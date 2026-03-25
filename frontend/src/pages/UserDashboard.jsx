import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, Activity, Heart, List } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newScore, setNewScore] = useState('');
  const [latestDraw, setLatestDraw] = useState(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, scoresRes, drawRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/score'),
        api.get('/draw')
      ]);
      setProfile(profileRes.data);
      setScores(scoresRes.data);
      if (drawRes.data && drawRes.data.length > 0) {
        setLatestDraw(drawRes.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (plan) => {
    try {
      const res = await api.post('/payment/create-checkout-session', { plan });
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Subscription error', error);
      alert(error.response?.data?.message || 'Failed to initiate subscription');
    }
  };

  const runMVPDraw = async () => {
    try {
      setDrawing(true);
      await api.post('/draw/run', { totalPrizePool: 5000, isAlgorithmic: false });
      alert('MVP Draw executed successfully!');
      fetchData(); // Refresh UI
    } catch (error) {
      console.error('Draw Error', error);
      alert('Failed to execute draw');
    } finally {
      setDrawing(false);
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (!newScore || newScore < 1 || newScore > 45) {
      alert('Score must be between 1 and 45');
      return;
    }
    
    try {
      await api.post('/score', { score: Number(newScore) });
      setNewScore('');
      fetchData(); // Refresh scores
    } catch (error) {
      console.error('Error adding score', error);
      alert('Failed to add score');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '64px' }}>Loading your dashboard...</div>;

  if (!profile?.is_subscribed) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Unlock the FairwayFund Experience</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '1.1rem' }}>
          Subscribe to enter monthly draws, track your scores, and support global charities.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3>Monthly Plan</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>£9<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>
            <button className="btn-secondary" onClick={() => subscribe('monthly')}>Subscribe Monthly</button>
          </div>
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '12px', right: '-32px', background: 'var(--accent-primary)', padding: '4px 40px', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: 'bold' }}>SAVE 20%</div>
            <h3>Yearly Plan</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>£86<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/yr</span></div>
            <button className="btn-primary" onClick={() => subscribe('yearly')}>Subscribe Yearly</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1>Welcome, {user.email.split('@')[0]}</h1>
        <p style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <Activity size={18} /> Active Subscriber
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Score Management */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <List color="var(--accent-primary)" size={24} />
            <h3 style={{ margin: 0 }}>Recent Scores</h3>
          </div>
          
          <form onSubmit={handleScoreSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="number" 
              min="1" max="45"
              placeholder="Stableford (1-45)" 
              className="input-field"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>Add</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {scores.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No scores recorded yet. Add 5 to enter the draw!</p>
            ) : (
              scores.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: i === 0 ? 'var(--accent-primary)' : 'inherit' }}>{s.score} pt</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{new Date(s.date).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charity & Draw Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart color="var(--accent-primary)" size={24} />
              <h3 style={{ margin: 0 }}>Your Charity Impact</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>You are contributing 10% of your subscription fee globally. Visit the Charities directory to assign your funds to a specific cause.</p>
            <a href="/charities" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>Manage Selection</a>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity color="var(--accent-primary)" size={24} />
                <h3 style={{ margin: 0 }}>MVP Draw Simulation</h3>
              </div>
              <button className="btn-primary" onClick={runMVPDraw} disabled={drawing || scores.length < 5}>
                {drawing ? 'Running...' : 'Run MVP Draw'}
              </button>
            </div>
            {scores.length < 5 && (
              <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>*Requires 5 scores to enter</p>
            )}
            
            {latestDraw ? (
              <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Latest Results</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--accent-primary)' }}>
                  {latestDraw.winning_numbers?.join(' - ')}
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Total Prize Pool: £{latestDraw.prize_pool} | Match 5 Winners: {latestDraw.match_5_winners?.length || 0}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No draws have been executed yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
