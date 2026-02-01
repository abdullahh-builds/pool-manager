import { supabase } from './supabase';

export const downloadBackup = async () => {
  try {
    const { data, error } = await supabase
      .from('pool_data')
      .select('*')
      .single();
    
    if (error) throw error;
    
    if (data) {
      const backup = {
        timestamp: new Date().toISOString(),
        data: data
      };
      
      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pool-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Backup failed:", error);
    return false;
  }
};
