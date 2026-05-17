const { supabase } = require('../lib/supabase');

const registerForKegiatan = async (req, res, next) => {
  try {
    const { kegiatan_id, nama, email, nomor_identitas, institusi, nomor_telepon, catatan } = req.body;

    // Check capacity
    const { data: kegiatan, error: kegError } = await supabase
      .from('kegiatan')
      .select('jumlah_terdaftar, kuota')
      .eq('kegiatan_id', kegiatan_id)
      .single();

    if (kegError) throw kegError;
    if (!kegiatan) return res.status(404).json({ success: false, message: 'Kegiatan tidak ditemukan' });
    if (kegiatan.jumlah_terdaftar >= kegiatan.kuota) {
      return res.status(400).json({ success: false, message: 'Kuota sudah penuh' });
    }

    // Upsert or Check Peserta
    let { data: existingPeserta } = await supabase
      .from('peserta')
      .select('peserta_id')
      .eq('email', email)
      .single();

    let peserta_id;
    if (existingPeserta) {
      peserta_id = existingPeserta.peserta_id;
      // Option: update info if needed
    } else {
      const { data: newPeserta, error: insertError } = await supabase
        .from('peserta')
        .insert([{ nama, email, nomor_identitas, institusi, nomor_telepon }])
        .select()
        .single();
      if (insertError) throw insertError;
      peserta_id = newPeserta.peserta_id;
    }

    // Insert pendaftaran (junction table)
    const { data: pendaftaran, error: regError } = await supabase
      .from('pendaftaran')
      .insert([{
        peserta_id,
        kegiatan_id,
        catatan,
        status_pendaftaran: 'terdaftar'
      }])
      .select()
      .single();

    if (regError) {
      if (regError.code === '23505') { // Unique constraint violation
        return res.status(400).json({ success: false, message: 'Anda sudah terdaftar di kegiatan ini' });
      }
      throw regError;
    }

    // Note: Database triggers handle the increment of jumlah_terdaftar and inserting into notifikasi

    res.status(201).json({ success: true, data: pendaftaran });
  } catch (error) {
    next(error);
  }
};

const getRiwayatByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Get peserta_id
    const { data: peserta } = await supabase.from('peserta').select('peserta_id').eq('email', email).single();
    if (!peserta) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('pendaftaran')
      .select(`
        *,
        kegiatan (
          judul, tanggal_mulai, lokasi
        )
      `)
      .eq('peserta_id', peserta.peserta_id)
      .order('tanggal_daftar', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForKegiatan,
  getRiwayatByEmail
};
