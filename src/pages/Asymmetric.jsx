import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, RefreshCw, Copy } from 'lucide-react';
import { generateRSAKeyPair, rsaEncrypt, rsaDecrypt } from '../utils/rsa';

const Asymmetric = ({ showToast }) => {
  const [keySize, setKeySize] = useState('2048');
  const [generatedKeys, setGeneratedKeys] = useState(null);
  const [encMode, setEncMode] = useState('encrypt');
  const [input, setInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [genLoading, setGenLoading] = useState(false);
  const [procLoading, setProcLoading] = useState(false);

  const handleGenerateKeys = () => {
    setGenLoading(true);
    setError(null);
    setGeneratedKeys(null);
    
    setTimeout(() => {
      const res = generateRSAKeyPair(parseInt(keySize));
      if (res.error) {
        setError(res.error);
      } else {
        setGeneratedKeys(res);
        setKeyInput(encMode === 'encrypt' ? res.publicKey : res.privateKey);
        showToast('🔐 Cặp khóa RSA đã được tạo thành công!');
      }
      setGenLoading(false);
    }, 100);
  };

  const handleProcess = () => {
    if (!input) { setError('⚠ Nhập văn bản đầu vào.'); return; }
    if (!keyInput) { setError('⚠ Nhập key PEM hoặc tạo key pair trước.'); return; }

    setProcLoading(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      let res;
      if (encMode === 'encrypt') {
        res = rsaEncrypt(input, keyInput);
      } else {
        res = rsaDecrypt(input, keyInput);
      }

      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.ciphertext || res.plaintext);
      }
      setProcLoading(false);
    }, 300);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy!');
  };

  const toggleMode = (mode) => {
    setEncMode(mode);
    setError(null);
    setResult(null);
    if (generatedKeys) {
      setKeyInput(mode === 'encrypt' ? generatedKeys.publicKey : generatedKeys.privateKey);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={28} color="var(--accent)" />
          <div>
            <div className="page-title">Asymmetric Encryption — RSA</div>
            <div className="page-subtitle">Mã hóa bất đối xứng — Public Key mã hóa, Private Key giải mã</div>
          </div>
        </div>
        <span className="status-badge safe"><span className="dot"></span>RSA-2048</span>
      </div>

      <div className="card">
        <div className="card-title">🔐 Key Generation</div>
        <div className="form-group">
          <label>Key Size</label>
          <select value={keySize} onChange={(e) => setKeySize(e.target.value)} style={{ width: '200px' }}>
            <option value="1024">1024-bit (nhanh, demo)</option>
            <option value="2048">2048-bit (chuẩn)</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleGenerateKeys} disabled={genLoading}>
          {genLoading ? <span className="spinner"></span> : <RefreshCw size={18} />}
          Generate Key Pair
        </button>

        {generatedKeys && (
          <div className="two-col" style={{ marginTop: '1.5rem' }}>
            <div>
              <div className="output-label">
                <span>🔓 Public Key (PEM)</span>
                <button className="copy-btn" onClick={() => handleCopy(generatedKeys.publicKey)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Copy size={14} /> copy
                </button>
              </div>
              <div className="key-display" style={{ minHeight: '120px', fontSize: '0.7rem' }}>
                {generatedKeys.publicKey}
              </div>
            </div>
            <div>
              <div className="output-label">
                <span>🔒 Private Key (PEM)</span>
                <button className="copy-btn" onClick={() => handleCopy(generatedKeys.privateKey)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Copy size={14} /> copy
                </button>
              </div>
              <div className="key-display" style={{ minHeight: '120px', fontSize: '0.7rem', color: 'var(--danger)' }}>
                {generatedKeys.privateKey}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mode-toggle" style={{ width: '280px' }}>
        <button className={`mode-toggle-btn ${encMode === 'encrypt' ? 'active' : ''}`} onClick={() => toggleMode('encrypt')}>
          <Lock size={16} /> Encrypt
        </button>
        <button className={`mode-toggle-btn ${encMode === 'decrypt' ? 'active' : ''}`} onClick={() => toggleMode('decrypt')}>
          <Unlock size={16} /> Decrypt
        </button>
      </div>

      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-title">Input</div>
            <div className="form-group">
              <label>{encMode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)'}</label>
              <textarea 
                rows="4" 
                placeholder="Nhập văn bản..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>{encMode === 'encrypt' ? 'Public Key (PEM)' : 'Private Key (PEM)'}</label>
              <textarea 
                rows="5" 
                placeholder="-----BEGIN PUBLIC KEY-----"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
              ></textarea>
            </div>
            <div className="info-box" style={{ marginBottom: '0.75rem' }}>
              {encMode === 'encrypt' 
                ? 'Encrypt với Public Key — chỉ người có Private Key mới giải mã được.'
                : 'Decrypt với Private Key — chỉ chủ sở hữu private key mới thực hiện được.'}
            </div>
            <button className="btn btn-primary" onClick={handleProcess} disabled={procLoading}>
              {procLoading ? <span className="spinner"></span> : (encMode === 'encrypt' ? <Lock size={18} /> : <Unlock size={18} />)}
              {encMode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
            </button>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title">Output</div>
            <div className="output-label">
              <span>{encMode === 'encrypt' ? 'Ciphertext (Base64)' : 'Plaintext'}</span>
              <button className="copy-btn" onClick={() => handleCopy(result)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Copy size={14} /> copy
              </button>
            </div>
            <div className={`output-box ${error ? 'error' : ''} ${!result && !error ? 'empty' : ''}`} style={{ minHeight: '160px' }}>
              {error || result || 'Kết quả sẽ hiển thị ở đây...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asymmetric;
