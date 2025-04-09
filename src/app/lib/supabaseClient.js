import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API key operations
export const apiKeyService = {
  // Fetch all API keys
  async fetchApiKeys() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create a new API key
  async createApiKey(newKey) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // Delete an API key
  async deleteApiKey(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Toggle API key status
  async toggleKeyStatus(id, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from('api_keys')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) throw error;
    return newStatus;
  },

  // Update API key
  async updateApiKey(id, updates) {
    const { error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
