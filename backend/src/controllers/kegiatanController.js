const { supabase } = require('../lib/supabase');

const getAllKegiatan = async (req, res, next) => {
  try {
    const { jenis, search, page = 1, limit = 6 } = req.query;
    
    let query = supabase.from('kegiatan').select('*', { count: 'exact' });

    if (jenis && jenis !== 'All') {
      query = query.eq('jenis', jenis.toLowerCase());
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      if (searchLower === 'seminar' || searchLower === 'workshop') {
        query = query.or(`judul.ilike.%${search}%,penyelenggara.ilike.%${search}%,lokasi.ilike.%${search}%,jenis.eq.${searchLower}`);
      } else {
        query = query.or(`judul.ilike.%${search}%,penyelenggara.ilike.%${search}%,lokasi.ilike.%${search}%`);
      }
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('tanggal_mulai', { ascending: true });

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

const getKegiatanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('kegiatan_id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Kegiatan not found' });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createKegiatan = async (req, res, next) => {
  try {
    const admin_id = req.user.admin_id; // From custom JWT
    const eventData = req.body;
    
    const payload = {
      ...eventData,
      admin_id
    };

    const { data, error } = await supabase
      .from('kegiatan')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data, message: 'Kegiatan Berhasil Ditambahkan' });
  } catch (error) {
    next(error);
  }
};

const updateKegiatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    
    const { data, error } = await supabase
      .from('kegiatan')
      .update(eventData)
      .eq('kegiatan_id', id)
      .select()
      .single();

    if (error) throw error;
    
    res.json({ success: true, data, message: 'Kegiatan Berhasil Diedit' });
  } catch (error) {
    next(error);
  }
};

const deleteKegiatan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('kegiatan')
      .delete()
      .eq('kegiatan_id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Kegiatan Berhasil Dihapus' });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const { count: totalEvents } = await supabase.from('kegiatan').select('*', { count: 'exact', head: true });
    const { count: totalParticipants } = await supabase.from('pendaftaran').select('*', { count: 'exact', head: true });
    const { count: upcomingEvents } = await supabase.from('kegiatan').select('*', { count: 'exact', head: true }).gt('tanggal_mulai', new Date().toISOString());

    const { data: recentEvents } = await supabase
      .from('kegiatan')
      .select('kegiatan_id, judul, tanggal_mulai, jenis, status, kuota, jumlah_terdaftar')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents,
          totalParticipants,
          upcomingEvents
        },
        recentEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKegiatan,
  getKegiatanById,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
  getDashboardStats
};
