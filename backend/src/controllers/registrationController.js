const { supabase } = require('../lib/supabase');

const generateRegistrationId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const c1 = chars.charAt(Math.floor(Math.random() * chars.length));
  const c2 = chars.charAt(Math.floor(Math.random() * chars.length));
  return `EVT-${num}-${c1}${c2}`;
};

const registerForEvent = async (req, res, next) => {
  try {
    const { event_id, full_name, email, phone, institution, notes } = req.body;

    // Check event capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('current_participants, max_participants')
      .eq('id', event_id)
      .single();

    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ success: false, message: 'Event is already full' });
    }

    // Check if user already registered for this event
    const { data: existingReg } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', event_id)
      .eq('email', email)
      .single();

    if (existingReg) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event' });
    }

    const registration_id = generateRegistrationId();

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .insert([{
        event_id,
        registration_id,
        full_name,
        email,
        phone,
        institution,
        notes
      }])
      .select()
      .single();

    if (regError) throw regError;

    // Update event participants count
    const newParticipantsCount = event.current_participants + 1;
    let newStatus = 'Active';
    if (newParticipantsCount >= event.max_participants) {
      newStatus = 'Closed';
    } else if (newParticipantsCount >= event.max_participants * 0.9) {
      newStatus = 'Almost Full';
    }

    await supabase
      .from('events')
      .update({ 
        current_participants: newParticipantsCount,
        status: newStatus
      })
      .eq('id', event_id);

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

const getRegistrationsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (
          title, date, location
        )
      `)
      .eq('email', email)
      .order('registered_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getRegistrationsByEmail
};
