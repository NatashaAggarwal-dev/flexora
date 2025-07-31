import { supabase } from '../lib/supabase';

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