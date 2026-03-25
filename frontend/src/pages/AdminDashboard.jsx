import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [drawResult, setDrawResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/draw');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const executeDraw = async (isAlgorithmic) => {
    if (!confirm(`Are you sure you want to execute an ${isAlgorithmic ? 'Algorithmic' : 'Random'} draw?`)) return;
    
    setLoading(true);
    setDrawResult(null);
    try {
      const res = await api.post('/draw/run', {
        totalPrizePool: 10000,
        isAlgorithmic
      });
      setDrawResult(res.data);
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing draw');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1>Admin Control Panel</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage draws, prize pools, and platform operations.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3>Execute Draw</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Run the monthly draw. This will distribute the prize pool (40% match 5, 35% match 4, 25% match 3).</p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              className="btn-primary" 
              onClick={() => executeDraw(false)} 
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Running...' : 'Run Random Draw'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => executeDraw(true)} 
              disabled={loading}
              style={{ flex: 1 }}
            >
              Run Algorithmic Draw
            </button>
          </div>

          {drawResult && (
             <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '8px' }}>
               <h4>Draw Successful!</h4>
               <p>Winning Numbers: {drawResult.winningNumbers.join(', ')}</p>
               <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                 <li>Match 5 Winners: {drawResult.winners.match5.length} (Payout/ea: £{drawResult.payouts.match5.toFixed(2)})</li>
                 <li>Match 4 Winners: {drawResult.winners.match4.length} (Payout/ea: £{drawResult.payouts.match4.toFixed(2)})</li>
                 <li>Match 3 Winners: {drawResult.winners.match3.length} (Payout/ea: £{drawResult.payouts.match3.toFixed(2)})</li>
               </ul>
             </div>
          )}
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3>Draw History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No previous draws.</p>
            ) : (
              history.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{d.winning_numbers.join(', ')}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Total Winners: {(d.match_5_winners?.length || 0) + (d.match_4_winners?.length || 0) + (d.match_3_winners?.length || 0)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {new Date(d.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
