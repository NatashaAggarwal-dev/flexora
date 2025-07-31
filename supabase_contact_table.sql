-- Create the contact_submissions table for Flexora website
-- Run this query in your Supabase SQL Editor

-- Create the contact_submissions table
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (form submissions from website)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Create an index on created_at for better performance
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Optional: Create an index on email for potential future queries
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'contact_submissions'
ORDER BY ordinal_position; 