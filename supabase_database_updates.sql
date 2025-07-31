-- Flexora Database Updates for Enhanced User Management
-- Run this in your Supabase SQL Editor

-- Update profiles table to ensure email uniqueness and add required fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email',
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;

-- Create unique constraint on email across all users
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_unique ON profiles(email);

-- Update the handle_new_user function to handle both Google and email auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already exists (for Google OAuth users who might sign up with email later)
  IF EXISTS (SELECT 1 FROM profiles WHERE email = NEW.email) THEN
    -- Update existing profile with new auth provider info
    UPDATE profiles 
    SET 
      auth_provider = CASE 
        WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN 'google'
        ELSE 'email'
      END,
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
      google_id = CASE 
        WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN NEW.raw_user_meta_data->>'sub'
        ELSE profiles.google_id
      END,
      updated_at = NOW()
    WHERE email = NEW.email;
  ELSE
    -- Create new profile
    INSERT INTO profiles (
      id, 
      email, 
      full_name, 
      avatar_url, 
      google_id,
      auth_provider,
      is_profile_complete
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NEW.raw_user_meta_data->>'avatar_url',
      CASE 
        WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN NEW.raw_user_meta_data->>'sub'
        ELSE NULL
      END,
      CASE 
        WHEN NEW.raw_user_meta_data->>'provider' = 'google' THEN 'google'
        ELSE 'email'
      END,
      false
    );
  END IF;
  
  -- Create default preferences if they don't exist
  IF NOT EXISTS (SELECT 1 FROM user_preferences WHERE user_id = NEW.id) THEN
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark profile as complete
CREATE OR REPLACE FUNCTION mark_profile_complete(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    is_profile_complete = true,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if email is available for registration
CREATE OR REPLACE FUNCTION check_email_availability(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM profiles WHERE email = email_address);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to allow profile completion
CREATE POLICY IF NOT EXISTS "Users can update own profile completion" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to get user profile with completion status
CREATE OR REPLACE FUNCTION get_user_profile_with_status(user_id UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  full_name VARCHAR,
  avatar_url TEXT,
  phone VARCHAR,
  auth_provider VARCHAR,
  is_profile_complete BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.phone,
    p.auth_provider,
    p.is_profile_complete,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the updates
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position; 