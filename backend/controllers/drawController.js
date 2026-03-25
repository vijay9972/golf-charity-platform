const supabase = require('../config/supabase');

const countMatches = (userScores, winningNumbers) => {
  const userScoreValues = userScores.map(s => s.score);
  return userScoreValues.filter(val => winningNumbers.includes(val)).length;
};

// @desc    Run a draw
// @route   POST /api/draw/run
// @access  Private/Admin
const runDraw = async (req, res, next) => {
  try {
    const { totalPrizePool, isAlgorithmic } = req.body;

    if (!totalPrizePool || totalPrizePool <= 0) {
      res.status(400);
      throw new Error('Please provide a valid prize pool amount.');
    }

    let winningNumbers = [];

    // Algorithmic based on user score frequencies vs pure random
    if (isAlgorithmic) {
      const { data: allScores } = await supabase.from('scores').select('score');
      const freq = {};
      allScores.forEach(s => {
        freq[s.score] = (freq[s.score] || 0) + 1;
      });
      // Pick numbers based on highest frequency (algorithmic representation)
      const sortedFreq = Object.entries(freq).sort((a,b) => b[1] - a[1]);
      const topNumbers = sortedFreq.slice(0, 10).map(x => Number(x[0]));
      
      while(winningNumbers.length < 5) {
        const pick = topNumbers[Math.floor(Math.random() * topNumbers.length)] || Math.floor(Math.random() * 45) + 1;
        if (!winningNumbers.includes(pick)) winningNumbers.push(pick);
      }
    } else {
      // Pure random: 5 unique numbers between 1 and 45
      while (winningNumbers.length < 5) {
        let r = Math.floor(Math.random() * 45) + 1;
        if (!winningNumbers.includes(r)) winningNumbers.push(r);
      }
    }

    // Evaluate all users
    const { data: scoresData, error: scoresError } = await supabase.from('scores').select('user_id, score');
    if (scoresError) throw new Error(scoresError.message);

    const userMap = {};
    scoresData.forEach(s => {
      if (!userMap[s.user_id]) userMap[s.user_id] = [];
      userMap[s.user_id].push(s);
    });

    const winners = {
      match5: [],
      match4: [],
      match3: []
    };

    Object.keys(userMap).forEach(userId => {
      const matchCount = countMatches(userMap[userId], winningNumbers);
      if (matchCount === 5) winners.match5.push(userId);
      else if (matchCount === 4) winners.match4.push(userId);
      else if (matchCount === 3) winners.match3.push(userId);
    });

    // 40% for match 5, 35% for match 4, 25% for match 3
    const payout5 = winners.match5.length > 0 ? (totalPrizePool * 0.40) / winners.match5.length : 0;
    const payout4 = winners.match4.length > 0 ? (totalPrizePool * 0.35) / winners.match4.length : 0;
    const payout3 = winners.match3.length > 0 ? (totalPrizePool * 0.25) / winners.match3.length : 0;

    // Save draw result
    const { data: drawResult, error: drawError } = await supabase.from('draws').insert([{
      winning_numbers: winningNumbers,
      prize_pool: totalPrizePool,
      match_5_winners: winners.match5,
      match_4_winners: winners.match4,
      match_3_winners: winners.match3,
      payout_5: payout5,
      payout_4: payout4,
      payout_3: payout3,
      created_at: new Date().toISOString()
    }]);

    res.json({
      message: 'Draw executed',
      winningNumbers,
      winners,
      payouts: { match5: payout5, match4: payout4, match3: payout3 }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get draw history
// @route   GET /api/draw
// @access  Public
const getDrawHistory = async (req, res, next) => {
  try {
    const { data: draws, error } = await supabase.from('draws').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    res.json(draws);
  } catch (error) {
    next(error);
  }
}

module.exports = { runDraw, getDrawHistory };
