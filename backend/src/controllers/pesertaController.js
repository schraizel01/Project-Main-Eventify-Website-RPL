const { supabase } = require('../lib/supabase');

const getPeserta = async (req, res, next) => {
  try {
    const { kegiatan_id, search, page = 1, limit = 10 } = req.query;
    
    let query = supabase.from('pendaftaran').select(`
      pendaftaran_id,
      tanggal_daftar,
      status_pendaftaran,
      catatan,
      peserta!inner (peserta_id, nama, email, nomor_identitas, institusi, nomor_telepon),
      kegiatan (judul)
    `, { count: 'exact' });

    if (kegiatan_id) {
      query = query.eq('kegiatan_id', kegiatan_id);
    }
    
    if (search) {
      query = query.or(`nama.ilike.%${search}%,email.ilike.%${search}%`, { referencedTable: 'peserta' });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('tanggal_daftar', { ascending: false });

    const { data, count, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    next(error);
  }
};

const exportPeserta = async (req, res, next) => {
  try {
    const { kegiatan_id } = req.query;
    
    let query = supabase.from('pendaftaran').select(`
      pendaftaran_id,
      tanggal_daftar,
      status_pendaftaran,
      peserta (nama, email, nomor_identitas, institusi, nomor_telepon),
      kegiatan (judul)
    `);

    if (kegiatan_id) {
      query = query.eq('kegiatan_id', kegiatan_id);
    }

    const { data, error } = await query.order('tanggal_daftar', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'No participants found' });
    }

    const header = ['ID Pendaftaran', 'Judul Kegiatan', 'Nama', 'Email', 'No Identitas', 'Institusi', 'Telepon', 'Tanggal Daftar', 'Status'].join(',');
    const rows = data.map(r => {
      return [
        r.pendaftaran_id,
        `"${r.kegiatan?.judul || ''}"`,
        `"${r.peserta?.nama}"`,
        r.peserta?.email,
        r.peserta?.nomor_identitas,
        `"${r.peserta?.institusi}"`,
        r.peserta?.nomor_telepon,
        new Date(r.tanggal_daftar).toLocaleString(),
        r.status_pendaftaran
      ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="peserta.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPeserta,
  exportPeserta
};
