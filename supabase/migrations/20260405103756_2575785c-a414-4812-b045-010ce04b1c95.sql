CREATE TYPE public.study_group_role AS ENUM ('owner', 'member');

CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  weekly_goal INTEGER NOT NULL DEFAULT 100,
  max_members INTEGER NOT NULL DEFAULT 20,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.study_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role public.study_group_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE public.study_group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_study_groups_owner_user_id ON public.study_groups(owner_user_id);
CREATE INDEX idx_study_groups_level ON public.study_groups(level);
CREATE INDEX idx_study_groups_is_private ON public.study_groups(is_private);
CREATE INDEX idx_study_group_members_group_id ON public.study_group_members(group_id);
CREATE INDEX idx_study_group_members_user_id ON public.study_group_members(user_id);
CREATE INDEX idx_study_group_messages_group_id ON public.study_group_messages(group_id);
CREATE INDEX idx_study_group_messages_user_id ON public.study_group_messages(user_id);
CREATE INDEX idx_study_group_messages_created_at ON public.study_group_messages(created_at DESC);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_study_group(_group_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.study_groups g
    WHERE g.id = _group_id
      AND (
        g.is_private = false
        OR g.owner_user_id = _user_id
        OR EXISTS (
          SELECT 1
          FROM public.study_group_members m
          WHERE m.group_id = g.id
            AND m.user_id = _user_id
        )
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.is_study_group_owner(_group_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.study_groups
    WHERE id = _group_id
      AND owner_user_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.validate_study_group_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  _max_members INTEGER;
  _member_count INTEGER;
BEGIN
  SELECT max_members INTO _max_members
  FROM public.study_groups
  WHERE id = NEW.group_id;

  IF _max_members IS NULL THEN
    RAISE EXCEPTION 'Study group not found';
  END IF;

  IF TG_OP = 'INSERT' OR NEW.group_id IS DISTINCT FROM OLD.group_id THEN
    SELECT COUNT(*) INTO _member_count
    FROM public.study_group_members
    WHERE group_id = NEW.group_id;

    IF _member_count >= _max_members THEN
      RAISE EXCEPTION 'This study group is full';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_study_groups_updated_at
BEFORE UPDATE ON public.study_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER validate_study_group_membership_trigger
BEFORE INSERT OR UPDATE ON public.study_group_members
FOR EACH ROW
EXECUTE FUNCTION public.validate_study_group_membership();

CREATE POLICY "Authenticated users can read accessible study groups"
ON public.study_groups
FOR SELECT
TO authenticated
USING (
  is_private = false
  OR owner_user_id = auth.uid()
  OR public.can_access_study_group(id, auth.uid())
);

CREATE POLICY "Authenticated users can create their own study groups"
ON public.study_groups
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update their study groups"
ON public.study_groups
FOR UPDATE
TO authenticated
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Owners can delete their study groups"
ON public.study_groups
FOR DELETE
TO authenticated
USING (owner_user_id = auth.uid());

CREATE POLICY "Users can read memberships for accessible study groups"
ON public.study_group_members
FOR SELECT
TO authenticated
USING (public.can_access_study_group(group_id, auth.uid()));

CREATE POLICY "Users can join accessible study groups themselves"
ON public.study_group_members
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    public.can_access_study_group(group_id, auth.uid())
    OR public.is_study_group_owner(group_id, auth.uid())
  )
);

CREATE POLICY "Users can leave their own study groups"
ON public.study_group_members
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_study_group_owner(group_id, auth.uid()));

CREATE POLICY "Owners can update member roles in their study groups"
ON public.study_group_members
FOR UPDATE
TO authenticated
USING (public.is_study_group_owner(group_id, auth.uid()))
WITH CHECK (public.is_study_group_owner(group_id, auth.uid()));

CREATE POLICY "Users can read messages in accessible study groups"
ON public.study_group_messages
FOR SELECT
TO authenticated
USING (public.can_access_study_group(group_id, auth.uid()));

CREATE POLICY "Users can send messages in accessible study groups"
ON public.study_group_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND public.can_access_study_group(group_id, auth.uid())
);

CREATE POLICY "Users can edit their own messages"
ON public.study_group_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages or owners can moderate"
ON public.study_group_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_study_group_owner(group_id, auth.uid()));