import React from 'react';
import { Shield } from 'lucide-react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <div className="logo-icon"><Shield fill="var(--accent)" size={20} /></div>
        CryptoKit
      </div>
      <div className="header-badge">v1.0 — REACT VITE</div>
    </header>
  );
};

export default Header;
