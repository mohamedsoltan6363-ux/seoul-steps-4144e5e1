-- Add new columns to profiles table for enhanced registration
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name_arabic TEXT,
ADD COLUMN IF NOT EXISTS full_name_english TEXT,
ADD COLUMN IF NOT EXISTS national_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS location_address TEXT,
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('student', 'graduate', 'teacher', 'other')),
ADD COLUMN IF NOT EXISTS college_name TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS teaching_place TEXT,
ADD COLUMN IF NOT EXISTS other_occupation TEXT;

-- Create index on phone for faster login lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_national_id ON public.profiles(national_id);