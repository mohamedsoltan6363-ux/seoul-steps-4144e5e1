
-- 1. Explicit DELETE policy for lesson_progress
CREATE POLICY "Users can delete own progress"
ON public.lesson_progress
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Explicit DELETE policy for profiles
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 3. Validation constraints on profiles (NOT VALID to avoid blocking existing rows)
ALTER TABLE public.profiles
  ADD CONSTRAINT check_national_id_format CHECK (national_id IS NULL OR national_id ~ '^[0-9]{14}$') NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT check_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9]{7,15}$') NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT check_latitude_range CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)) NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT check_longitude_range CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)) NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT check_age_range CHECK (age IS NULL OR (age >= 5 AND age <= 120)) NOT VALID;
ALTER TABLE public.profiles
  ADD CONSTRAINT check_display_name_length CHECK (display_name IS NULL OR char_length(display_name) <= 255) NOT VALID;

-- 4. Harden handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_display_name TEXT;
BEGIN
  v_display_name := COALESCE(
    NULLIF(SUBSTRING(TRIM(new.raw_user_meta_data ->> 'full_name'), 1, 255), ''),
    'User'
  );

  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, v_display_name)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- 5. Lock certificates as immutable: explicitly deny UPDATE & DELETE
CREATE POLICY "Certificates are immutable - no updates"
ON public.certificates
FOR UPDATE
USING (false);

CREATE POLICY "Certificates are immutable - no deletes"
ON public.certificates
FOR DELETE
USING (false);
