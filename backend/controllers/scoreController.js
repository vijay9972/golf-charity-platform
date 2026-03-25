const supabase = require('../config/supabase');

// @desc    Add a new score and keep only the latest 5
// @route   POST /api/score
// @access  Private
const addScore = async (req, res, next) => {
  try {
    const { score, date } = req.body;
    const userId = req.user.id;

    if (score < 1 || score > 45) {
      res.status(400);
      throw new Error('Score must be between 1 and 45.');
    }

    // Insert the new score
    const { error: insertError } = await supabase
      .from('scores')
      .insert([{ user_id: userId, score, date: date || new Date().toISOString() }]);

    if (insertError) {
      res.status(400);
      throw new Error(insertError.message);
    }

    // Fetch all scores for the user, ordered by date descending
    const { data: scores, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (fetchError) {
      res.status(400);
      throw new Error(fetchError.message);
    }

    // Rolling list: keep only last 5 in reverse chronological order
    if (scores.length > 5) {
      const scoresToDelete = scores.slice(5);
      const idsToDelete = scoresToDelete.map(s => s.id);

      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('Failed to delete old scores:', deleteError);
      }
    }

    res.status(201).json({ message: 'Score added successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user scores
// @route   GET /api/score
// @access  Private
const getScores = async (req, res, next) => {
  try {
    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(scores);
  } catch (error) {
    next(error);
  }
};

module.exports = { addScore, getScores };
