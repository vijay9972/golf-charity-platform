import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '32px 16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
