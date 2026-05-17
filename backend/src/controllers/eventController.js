const { supabase } = require('../lib/supabase');

const getAllEvents = async (req, res, next) => {
  try {
    const { type, search, page = 1, limit = 6 } = req.query;
    
    let query = supabase.from('events').select('*', { count: 'exact' });

    if (type && type !== 'All') {
      query = query.eq('type', type);
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('date', { ascending: true });

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

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Event not found' });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data, message: 'Artikel Berhasil Ditambahkan' });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    res.json({ success: true, data, message: 'Artikel Berhasil Diedit' });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Artikel Berhasil Dihapus' });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true });
    const { count: totalParticipants } = await supabase.from('registrations').select('*', { count: 'exact', head: true });
    const { count: upcomingEvents } = await supabase.from('events').select('*', { count: 'exact', head: true }).gt('date', new Date().toISOString());

    // Get recently added events for the table
    const { data: recentEvents } = await supabase
      .from('events')
      .select('id, title, date, type, status, max_participants, current_participants')
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
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getDashboardStats
};
