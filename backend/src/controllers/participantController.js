const { supabase } = require('../lib/supabase');

const getParticipants = async (req, res, next) => {
  try {
    const { event_id, search, page = 1, limit = 10 } = req.query;
    
    let query = supabase.from('registrations').select('*, events(title)', { count: 'exact' });

    if (event_id) {
      query = query.eq('event_id', event_id);
    }
    
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('registered_at', { ascending: false });

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

const exportParticipants = async (req, res, next) => {
  try {
    const { event_id } = req.query;
    
    let query = supabase.from('registrations').select('registration_id, full_name, email, phone, institution, registered_at, events(title)');

    if (event_id) {
      query = query.eq('event_id', event_id);
    }

    const { data, error } = await query.order('registered_at', { ascending: false });

    if (error) throw error;

    // Convert JSON to CSV manually
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'No participants found' });
    }

    const header = ['Registration ID', 'Event Name', 'Full Name', 'Email', 'Phone', 'Institution', 'Registered At'].join(',');
    const rows = data.map(r => {
      return [
        r.registration_id,
        `"${r.events?.title || ''}"`,
        `"${r.full_name}"`,
        r.email,
        r.phone,
        `"${r.institution}"`,
        new Date(r.registered_at).toLocaleString()
      ].join(',');
    });

    const csvContent = [header, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="participants.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getParticipants,
  exportParticipants
};
