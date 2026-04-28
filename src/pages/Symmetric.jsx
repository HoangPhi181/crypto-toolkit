import React, { useState } from 'react';
import { Key, Lock, Unlock, RefreshCw, Trash2, Copy } from 'lucide-react';
import { aesEncrypt, aesDecrypt, generateAESKey } from '../utils/aes';
import { desEncrypt, desDecrypt, tripleDESEncrypt, tripleDESDecrypt, generateDESKey, generate3DESKey } from '../utils/des';

const Symmetric = ({ showToast }) => {
  const [algo, setAlgo] = useState('AES');
  const [mode, setMode] = useState('CBC');
  const [encMode, setEncMode] = useState('encrypt'); // encrypt | decrypt
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [result, setResult] = useState(null);
  const [resultIv, setResultIv] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const symInfoMap = {
    'AES-CBC': 'AES-CBC: Chuẩn vàng. Khóa 16/24/32 bytes. IV ngẫu nhiên = an toàn nhất.',
    'AES-ECB': 'AES-ECB: Không dùng IV. KHÔNG khuyến nghị — các block giống nhau cho ciphertext giống nhau.',
    '3DES-CBC': '3DES-CBC: Áp dụng DES 3 lần. Khóa 24 bytes. Đang bị deprecated.',
    'DES-CBC': 'DES-CBC: Khóa 8 bytes (56-bit hiệu dụng). Dễ bị brute-force. Chỉ dùng học tập!',
  };

  const keyHintMap = {
    'AES': '16, 24, hoặc 32 bytes (128/192/256-bit)',
    '3DES': '24 bytes (192-bit, 168-bit hiệu dụng)',
    'DES': '8 bytes (64-bit, 56-bit hiệu dụng)',
  };

  const handleGenKey = () => {
    let newKey = '';
    if (algo === 'AES') {
      newKey = generateAESKey(256);
    } else if (algo === '3DES') {
      newKey = generate3DESKey();
    } else {
      newKey = generateDESKey();
    }
    setKey(newKey);
    showToast('⚡ Khóa tự động tạo!');
  };

  const handleProcess = () => {
    if (!input) { setError('⚠ Vui lòng nhập văn bản đầu vào.'); return; }
    if (!key) { setError('⚠ Vui lòng nhập hoặc tạo khóa.'); return; }

    setLoading(true);
    setError(null);
    setResult(null);
    setResultIv(null);
    setMeta(null);

    setTimeout(() => {
      let res;
      if (encMode === 'encrypt') {
        if (algo === 'AES') {
          res = aesEncrypt(input, key, mode);
        } else if (algo === '3DES') {
          res = tripleDESEncrypt(input, key, iv);
        } else {
          res = desEncrypt(input, key, iv);
        }
        
        if (res.error) {
          setError(res.error);
        } else {
          setResult(res.ciphertext);
          setResultIv(res.iv);
          setMeta({
            algo: res.algo,
            keyBits: res.keyBits,
            inputLen: input.length,
            outputLen: res.ciphertext.length
          });
        }
      } else {
        if (algo === 'AES') {
          res = aesDecrypt(input, key, mode, iv);
        } else if (algo === '3DES') {
          res = tripleDESDecrypt(input, key, iv);
        } else {
          res = desDecrypt(input, key, iv);
        }

        if (res.error) {
          setError(res.error);
        } else {
          setResult(res.plaintext);
          setMeta({
            algo: (algo === '3DES' ? '3DES' : algo) + '-' + mode,
            keyBits: key.length * 8,
            inputLen: input.length,
            outputLen: res.plaintext.length
          });
        }
      }
      setLoading(false);
    }, 300);
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast('✅ Đã copy!');
  };

  const clear = () => {
    setInput('');
    setKey('');
    setIv('');
    setResult(null);
    setResultIv(null);
    setMeta(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Key size={28} color="var(--accent)" />
          <div>
            <div className="page-title">Symmetric Encryption</div>
            <div className="page-subtitle">Mã hóa đối xứng — cùng một khóa để mã hóa và giải mã</div>
          </div>
        </div>
        <div className="algo-tabs">
          <button className={`algo-tab ${algo === 'AES' && mode === 'CBC' ? 'active' : ''}`} onClick={() => {setAlgo('AES'); setMode('CBC');}}>AES-CBC</button>
          <button className={`algo-tab ${algo === 'AES' && mode === 'ECB' ? 'active' : ''}`} onClick={() => {setAlgo('AES'); setMode('ECB');}}>AES-ECB</button>
          <button className={`algo-tab ${algo === '3DES' ? 'active' : ''}`} onClick={() => {setAlgo('3DES'); setMode('CBC');}}>3DES-CBC</button>
          <button className={`algo-tab ${algo === 'DES' ? 'active' : ''}`} onClick={() => {setAlgo('DES'); setMode('CBC');}}>DES-CBC</button>
        </div>
      </div>

      <div className="info-box">{symInfoMap[`${algo}-${mode}`] || symInfoMap[`${algo}-CBC`]}</div>

      <div className="mode-toggle" style={{ width: '280px' }}>
        <button className={`mode-toggle-btn ${encMode === 'encrypt' ? 'active' : ''}`} onClick={() => setEncMode('encrypt')}>
          <Lock size={16} /> Encrypt
        </button>
        <button className={`mode-toggle-btn ${encMode === 'decrypt' ? 'active' : ''}`} onClick={() => setEncMode('decrypt')}>
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
                rows="5" 
                placeholder={encMode === 'encrypt' ? "Nhập văn bản cần mã hóa..." : "Nhập ciphertext cần giải mã..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Secret Key <span style={{ color: 'var(--text3)' }}>({keyHintMap[algo]})</span></label>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="Nhập hoặc tự động tạo khóa..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={handleGenKey}>⚡ Auto</button>
              </div>
            </div>
            {mode === 'CBC' && (
              <div className="form-group">
                <label>IV (Initialization Vector) <span style={{ color: 'var(--text3)' }}>{encMode === 'encrypt' ? '(tự động khi mã hóa)' : '(cần để giải mã)'}</span></label>
                <input 
                  type="text" 
                  placeholder="IV hex (để trống = tự động)"
                  value={iv}
                  onChange={(e) => setIv(e.target.value)}
                />
              </div>
            )}
            <div className="btn-group">
              <button className="btn btn-primary" onClick={handleProcess} disabled={loading}>
                {loading ? <span className="spinner"></span> : (encMode === 'encrypt' ? <Lock size={18} /> : <Unlock size={18} />)}
                {encMode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
              </button>
              <button className="btn btn-secondary" onClick={clear}>
                <Trash2 size={18} /> Clear
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title">Output</div>
            <div>
              <div className="output-label">
                <span>{encMode === 'encrypt' ? 'Ciphertext (Base64)' : 'Plaintext'}</span>
                <button className="copy-btn" onClick={() => handleCopy(result)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Copy size={14} /> copy
                </button>
              </div>
              <div className={`output-box ${error ? 'error' : ''} ${!result && !error ? 'empty' : ''}`}>
                {error || result || 'Kết quả sẽ hiển thị ở đây...'}
              </div>
            </div>
            {resultIv && (
              <div style={{ marginTop: '1rem' }}>
                <div className="output-label">
                  <span>IV (cần để giải mã)</span>
                  <button className="copy-btn" onClick={() => handleCopy(resultIv)}>📋 copy</button>
                </div>
                <div className="output-box" style={{ color: 'var(--warning)', minHeight: 'auto' }}>
                  {resultIv}
                </div>
              </div>
            )}
            {meta && (
              <div style={{ 
                marginTop: '1.5rem', 
                paddingTop: '1rem', 
                borderTop: '1px solid var(--border)',
                fontFamily: 'var(--mono)',
                fontSize: '0.75rem',
                color: 'var(--text3)',
                lineHeight: '1.6'
              }}>
                <div>Algo: <span style={{ color: 'var(--accent2)' }}>{meta.algo}</span> | Key: <span style={{ color: 'var(--accent3)' }}>{meta.keyBits}-bit</span></div>
                <div>Input: {meta.inputLen} chars → Output: {meta.outputLen} chars</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">🔬 So sánh thuật toán</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: 'var(--mono)' }}>
            <thead>
              <tr style={{ color: 'var(--text3)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Thuật toán</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Block Size</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Key Size</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem', color: 'var(--text)' }}>DES</td>
                <td style={{ padding: '0.5rem' }}>64-bit</td>
                <td style={{ padding: '0.5rem' }}>56-bit</td>
                <td style={{ padding: '0.5rem' }}><span className="status-badge unsafe"><span className="dot"></span>Không an toàn</span></td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', color: 'var(--text)' }}>3DES</td>
                <td style={{ padding: '0.5rem' }}>64-bit</td>
                <td style={{ padding: '0.5rem' }}>112/168-bit</td>
                <td style={{ padding: '0.5rem' }}><span className="status-badge warn"><span className="dot"></span>Deprecated</span></td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', color: 'var(--text)' }}>AES-128</td>
                <td style={{ padding: '0.5rem' }}>128-bit</td>
                <td style={{ padding: '0.5rem' }}>128-bit</td>
                <td style={{ padding: '0.5rem' }}><span className="status-badge safe"><span className="dot"></span>An toàn</span></td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem', color: 'var(--text)' }}>AES-256</td>
                <td style={{ padding: '0.5rem' }}>128-bit</td>
                <td style={{ padding: '0.5rem' }}>256-bit</td>
                <td style={{ padding: '0.5rem' }}><span className="status-badge safe"><span className="dot"></span>Khuyến nghị</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Symmetric;
