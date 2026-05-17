const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../lib/supabase');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Ambil data admin dari tabel
    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verifikasi password dengan bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      admin_id: admin.admin_id,
      email: admin.email,
      nama: admin.nama
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: payload
      }
    });

  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe
};
