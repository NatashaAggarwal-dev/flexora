import { createClient } from '@supabase/supabase-js';

// Supabase credentials for Flexora project
const supabaseUrl = 'https://xlvkjdqeisqksnuvlqxh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdmtqZHFlaXNxa3NudXZscXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Mzc0NzgsImV4cCI6MjA2OTUxMzQ3OH0.VJHQ3Sp9FN-jMLbBLfMfL5j3r7ccS0lXzImj8pr5Nw0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export const getContactSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact submissions:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    throw error;
  }
}; 