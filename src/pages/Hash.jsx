import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, Zap, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { hashMD5, hashSHA256, compareHashes, getByteSize } from '../utils/hash';

const Hash = ({ showToast }) => {
  const [input, setInput] = useState('');
  const [md5Res, setMd5Res] = useState(null);
  const [sha256Res, setSha256Res] = useState(null);
  const [inputSize, setInputSize] = useState(0);

  const [cmpA, setCmpA] = useState('');
  const [cmpB, setCmpB] = useState('');
  const [cmpResult, setCmpResult] = useState('Nhập hai văn bản để so sánh hash...');
  const [isSame, setIsSame] = useState(null);

  useEffect(() => {
    setInputSize(getByteSize(input));
  }, [input]);

  const handleHash = () => {
    if (!input) {
      setMd5Res(null);
      setSha256Res(null);
      return;
    }
    setMd5Res(hashMD5(input));
    setSha256Res(hashSHA256(input));
  };

  const handleClear = () => {
    setInput('');
    setMd5Res(null);
    setSha256Res(null);
  };

  useEffect(() => {
    if (!cmpA || !cmpB) {
      setCmpResult('Nhập hai văn bản để so sánh hash...');
      setIsSame(null);
      return;
    }

    const r = compareHashes(cmpA, cmpB);
    setIsSame(r.match);
    if (r.match) {
      setCmpResult('✅ KHỚP — SHA-256 giống nhau → Nội dung hoàn toàn giống nhau.');
    } else {
      setCmpResult(`❌ KHÔNG KHỚP — ${r.diffBits}/256 bit khác nhau (${r.diffPercent}%) — Avalanche Effect!`);
    }
  }, [cmpA, cmpB]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy!');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Fingerprint size={28} color="var(--accent)" />
          <div>
            <div className="page-title">Hash Functions</div>
            <div className="page-subtitle">Hàm băm một chiều — không thể đảo ngược</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-title">Input</div>
            <div className="form-group">
              <label>Văn bản cần hash</label>
              <textarea 
                rows="6" 
                placeholder="Nhập văn bản bất kỳ..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={handleHash} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} /> Hash ngay
              </button>
              <button className="btn btn-secondary" onClick={handleClear} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={18} /> Clear
              </button>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
              <div style={{ marginBottom: '0.4rem' }}>Kích thước đầu vào: <span style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)' }}>{inputSize} bytes</span></div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <div className="hash-algo-label">
              <div className="card-title" style={{ marginBottom: 0 }}>MD5</div>
              <span className="status-badge unsafe"><span className="dot"></span>Không an toàn</span>
            </div>
            <div className="output-label">
              <span>128-bit / 32 hex chars</span>
              <button className="copy-btn" onClick={() => handleCopy(md5Res?.hash)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Copy size={14} /> copy
              </button>
            </div>
            <div className={`output-box ${md5Res?.error ? 'error' : ''} ${!md5Res ? 'empty' : ''}`} style={{ minHeight: '48px', fontSize: '0.8rem' }}>
              {md5Res?.error || md5Res?.hash || '—'}
            </div>
          </div>

          <div className="card">
            <div className="hash-algo-label">
              <div className="card-title" style={{ marginBottom: 0 }}>SHA-256</div>
              <span className="status-badge safe"><span className="dot"></span>Khuyến nghị</span>
            </div>
            <div className="output-label">
              <span>256-bit / 64 hex chars</span>
              <button className="copy-btn" onClick={() => handleCopy(sha256Res?.hash)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Copy size={14} /> copy
              </button>
            </div>
            <div className={`output-box ${sha256Res?.error ? 'error' : ''} ${!sha256Res ? 'empty' : ''}`} style={{ minHeight: '48px', fontSize: '0.8rem' }}>
              {sha256Res?.error || sha256Res?.hash || '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">So sánh Hash — Kiểm tra toàn vẹn</div>
        <div className="two-col">
          <div>
            <div className="form-group">
              <label>Văn bản gốc</label>
              <input type="text" placeholder="Nhập văn bản A..." value={cmpA} onChange={(e) => setCmpA(e.target.value)}/>
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>Văn bản so sánh</label>
              <input type="text" placeholder="Nhập văn bản B..." value={cmpB} onChange={(e) => setCmpB(e.target.value)}/>
            </div>
          </div>
        </div>
        <div style={{ 
          fontFamily: 'var(--mono)', 
          fontSize: '0.8rem', 
          marginTop: '0.5rem', 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: isSame === true ? 'var(--success)' : isSame === false ? 'var(--danger)' : 'var(--text3)' 
        }}>
          {isSame === true && <CheckCircle size={16} />}
          {isSame === false && <XCircle size={16} />}
          {cmpResult.replace('✅ ', '').replace('❌ ', '')}
        </div>
      </div>
    </div>
  );
};

export default Hash;
