import { createClient } from '@supabase/supabase-js';

// Get these from Supabase project settings → API
const supabaseUrl = 'https://zdeewiebgeuwbgbbqoym.supabase.co';
const supabaseAnonKey = 'sb_publishable_f0D_9jKzPAxRhfGTQtEgfw_0K929b5o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLE_NAME = 'pool_data';

export const streamPoolData = (callback: (data: any) => void, onError: (error: any) => void) => {
  // Subscribe to real-time changes
  const channel = supabase
    .channel('pool-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, (payload) => {
      callback(payload.new);
    })
    .subscribe();

  // Get initial data
  supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', 1)
    .single()
    .then(({ data, error }) => {
      if (error) {
        if (error.code === 'PGRST116') {
          // No data exists, return null to trigger seeding
          callback(null);
        } else {
          onError({ code: error.code, message: error.message });
        }
      } else {
        // Check if users array exists and has data
        if (!data.users || data.users.length === 0) {
          callback(null); // Trigger seeding
        } else {
          callback(data);
        }
      }
    });

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

export const updatePoolData = async (data: any) => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert({ id: 1, ...data });
  
  if (error) {
    throw { code: error.code, message: error.message };
  }
};

export const resetPoolData = async (data: any) => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ ...data })
    .eq('id', 1);
  
  if (error) {
    throw { code: error.code, message: error.message };
  }
};
