const supabase = require('../config/supabase');

// @desc    Get list of charities (with search)
// @route   GET /api/charity
// @access  Public
const getCharities = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = supabase.from('charities').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: charities, error } = await query;

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(charities);
  } catch (error) {
    next(error);
  }
};

// @desc    Select a charity and set contribution percentage
// @route   POST /api/charity/select
// @access  Private
const selectCharity = async (req, res, next) => {
  try {
    const { charityId, percentage } = req.body;

    if (!charityId || percentage < 10) {
      res.status(400);
      throw new Error('Please select a charity and a valid percentage (min 10%).');
    }

    const { data, error } = await supabase
      .from('user_charity_selections')
      .upsert({ user_id: req.user.id, charity_id: charityId, percentage }, { onConflict: 'user_id' });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'Charity preference updated', data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCharities, selectCharity };
