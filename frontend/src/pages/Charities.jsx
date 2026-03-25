import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Heart } from 'lucide-react';

const Charities = () => {
  const { user } = useAuth();
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchCharities = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/charity${search ? `?search=${search}` : ''}`);
      setCharities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (charityId) => {
    if (!user) {
      alert('Please log in to select a charity.');
      return;
    }
    
    const percentage = prompt("Enter percentage of subscription to contribute (min 10):", "10");
    const parsed = parseInt(percentage);
    
    if (!parsed || parsed < 10) {
      alert("Invalid percentage. Minimum is 10%.");
      return;
    }

    try {
      await api.post('/charity/select', { charityId, percentage: parsed });
      alert('Charity successfully selected!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update selection');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <header style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '16px' }}>Impact Directory</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Discover verified organizations making a real impact. Direct your subscription funds exactly where you want them to go.
        </p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', position: 'relative' }}>
        <Search style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-secondary)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search for charities..." 
          className="input-field" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '48px', fontSize: '1.1rem' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading directory...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {charities.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No organizations found.
            </div>
          )}
          {charities.map(c => (
            <div key={c.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0 }}>{c.name}</h3>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                  {c.category || 'General'}
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1 }}>
                {c.description || 'A verified organization contributing to global causes.'}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <MapPin size={14} /> {c.location || 'Global'}
              </div>

              <button 
                className="btn-secondary" 
                style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={() => handleSelect(c.id)}
              >
                <Heart size={16} /> Support Cause
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Charities;
