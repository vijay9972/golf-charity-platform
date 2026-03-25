import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      <section style={{ textAlign: 'center', padding: '64px 0', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, maxWidth: '800px' }}>
          Play with purpose. <br />
          <span className="gradient-text">Make every stroke count.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Join a community driven by passion and philanthropy. Track your progress, participate in monthly reward draws, and fund charities that matter to you.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1.1rem' }}>Get Started</Link>
          <Link to="/charities" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '1.1rem' }}>View Charities</Link>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Target color="var(--accent-primary)" size={24} />
          </div>
          <h3>Track Your Performance</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Record your last 5 Stableford scores. See your rolling patterns and analyze your consistency over time without the clutter.</p>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <TrendingUp color="var(--accent-primary)" size={24} />
          </div>
          <h3>Monthly Draws</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Your score patterns automatically enter you into our monthly algorithmic draws. Win back big from the collective prize pool.</p>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Heart color="var(--accent-primary)" size={24} />
          </div>
          <h3>Support Causes</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Directly control where your impact goes. A portion of every subscription fuels charities making a real difference globally.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
