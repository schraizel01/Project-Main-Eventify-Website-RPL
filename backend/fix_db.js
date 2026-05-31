const { supabase } = require('./src/lib/supabase');

async function fixDb() {
  try {
    console.log("Fixing kegiatan_id: 6 (Pengelolaan AI) jumlah_terdaftar count...");
    
    // Check actual registration count in pendaftaran table
    const { count, error: countError } = await supabase
      .from('pendaftaran')
      .select('*', { count: 'exact', head: true })
      .eq('kegiatan_id', 6);
      
    if (countError) throw countError;
    
    console.log(`Actual count of registrations in pendaftaran table: ${count}`);
    
    // Update kegiatan table to match actual registration count
    const { data, error } = await supabase
      .from('kegiatan')
      .update({ jumlah_terdaftar: count })
      .eq('kegiatan_id', 6)
      .select()
      .single();

    if (error) throw error;
    
    console.log("Successfully fixed kegiatan data:", data);
    console.log(`Now kegiatan has kuota: ${data.kuota} and jumlah_terdaftar: ${data.jumlah_terdaftar}`);
  } catch (err) {
    console.error("Error fixing database:", err);
  }
}

fixDb();
