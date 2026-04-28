import React from 'react';
import { Home, Key, ShieldCheck, Fingerprint } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: <Home size={18} /> },
    { id: 'symmetric', label: 'Symmetric', icon: <Key size={18} />, badge: 'AES DES' },
    { id: 'asymmetric', label: 'Asymmetric', icon: <ShieldCheck size={18} />, badge: 'RSA' },
    { id: 'hash', label: 'Hash', icon: <Fingerprint size={18} />, badge: 'SHA MD5' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-section">Menu</div>
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <div className="nav-icon">{item.icon}</div>
          {item.label}
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
