const supabase = require('../config/supabase');

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      res.status(400);
      throw new Error(error.message);
    }
    
    // If profile doesn't exist yet, return auth user info
    res.json(profile || { id: req.user.id, email: req.user.email });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile };
