import React from 'react';
import { Key, ShieldCheck, Fingerprint, Info } from 'lucide-react';
import '../styles/Home.css';

const Home = ({ onNavigate }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="page-title">Cryptography Toolkit</div>
          <div className="page-subtitle">Công cụ học tập mã hóa — Đồ án môn Bảo mật thông tin</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <span className="status-badge warn"><span className="dot"></span>MD5 / DES — Không an toàn (học thuật)</span>
        <span className="status-badge safe"><span className="dot"></span>AES-256 — Được khuyến nghị</span>
        <span className="status-badge safe"><span className="dot"></span>RSA-2048 — Tiêu chuẩn</span>
        <span className="status-badge safe"><span className="dot"></span>SHA-256 — Được khuyến nghị</span>
      </div>

      <div className="welcome-grid" style={{ marginTop: '2rem' }}>
        <div className="feature-card fc-sym" onClick={() => onNavigate('symmetric')}>
          <div className="feature-card-icon"><Key size={32} /></div>
          <div className="feature-card-title">Symmetric Encryption</div>
          <div className="feature-card-desc">Mã hóa và giải mã bằng khóa bí mật chia sẻ. Nhanh, phù hợp dữ liệu lớn.</div>
          <div className="feature-card-algos">
            <span className="algo-pill">DES</span>
            <span className="algo-pill">3DES</span>
            <span className="algo-pill">AES-CBC</span>
            <span className="algo-pill">AES-ECB</span>
          </div>
        </div>
        
        <div className="feature-card fc-asym" onClick={() => onNavigate('asymmetric')}>
          <div className="feature-card-icon"><ShieldCheck size={32} /></div>
          <div className="feature-card-title">Asymmetric Encryption</div>
          <div className="feature-card-desc">Cặp khóa Public/Private. An toàn trao đổi khóa, chữ ký số.</div>
          <div className="feature-card-algos">
            <span className="algo-pill">RSA-2048</span>
          </div>
        </div>
        
        <div className="feature-card fc-hash" onClick={() => onNavigate('hash')}>
          <div className="feature-card-icon"><Fingerprint size={32} /></div>
          <div className="feature-card-title">Hash Functions</div>
          <div className="feature-card-desc">Hàm băm một chiều. Kiểm tra toàn vẹn dữ liệu, lưu mật khẩu.</div>
          <div className="feature-card-algos">
            <span className="algo-pill">MD5</span>
            <span className="algo-pill">SHA-256</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={18} color="var(--accent)" /> Lưu ý giáo dục
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: '1.7' }}>
          Ứng dụng này được xây dựng cho mục đích <strong style={{ color: 'var(--text)' }}>học tập</strong>. 
          MD5 và DES đã bị <strong style={{ color: 'var(--danger)' }}>khai thác trong thực tế</strong> và không nên dùng cho hệ thống production. 
          Ưu tiên sử dụng <strong style={{ color: 'var(--success)' }}>AES-256-CBC</strong> và <strong style={{ color: 'var(--success)' }}>SHA-256</strong> trong các ứng dụng thực tế.
        </p>
      </div>
    </div>
  );
};

export default Home;
