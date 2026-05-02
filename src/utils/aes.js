/**
 * AES Encrypt
 * @param {string} plaintext - Văn bản cần mã hóa
 * @param {string} key - Khóa (phải là 16, 24, hoặc 32 ký tự)
 * @param {string} mode - 'CBC' hoặc 'ECB'
 * @param {string} ivHex - IV dạng hex (chỉ dùng cho CBC, để trống = tự tạo)
 * @returns {{ ciphertext: string, iv: string, error: string }}
 */
function aesEncrypt(plaintext, key, mode = 'CBC', ivHex = '') {
  // === VALIDATE ===
  const validKeySizes = [16, 24, 32];
  if (!validKeySizes.includes(key.length)) {
    return { error: `Lỗi AES: Khóa phải là 16, 24, hoặc 32 ký tự. Hiện tại: ${key.length}` };
  }
  if (!plaintext) return { error: 'Lỗi: Plaintext không được để trống.' };

  try {
    const keyWA = CryptoJS.enc.Utf8.parse(key);
    let cfg, usedIV;

    if (mode === 'ECB') {
      cfg = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
    } else {
      // CBC mode — tạo IV ngẫu nhiên nếu không có
      const iv = ivHex
        ? CryptoJS.enc.Hex.parse(ivHex)
        : CryptoJS.lib.WordArray.random(16);
      usedIV = iv.toString(CryptoJS.enc.Hex);
      cfg = { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
    }

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plaintext), keyWA, cfg
    );

    return {
      ciphertext: encrypted.toString(), // Base64
      iv: usedIV || null,
      keyBits: key.length * 8,
      algo: `AES-${mode}`
    };
  } catch (e) {
    return { error: 'Lỗi AES Encrypt: ' + e.message };
  }
}

/**
 * AES Decrypt
 */
function aesDecrypt(ciphertext, key, mode = 'CBC', ivHex = '') {
  const validKeySizes = [16, 24, 32];
  if (!validKeySizes.includes(key.length)) {
    return { error: `Lỗi AES: Khóa phải là 16, 24, hoặc 32 ký tự. Hiện tại: ${key.length}` };
  }
  if (!ciphertext) return { error: 'Lỗi: Ciphertext không được để trống.' };
  if (mode === 'CBC' && !ivHex) return { error: 'Lỗi CBC: Cần nhập IV để giải mã!' };

  try {
    const keyWA = CryptoJS.enc.Utf8.parse(key);
    let cfg;

    if (mode === 'ECB') {
      cfg = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
    } else {
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      cfg = { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
    }

    const decrypted = CryptoJS.AES.decrypt(ciphertext, keyWA, cfg);
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    if (!plaintext) throw new Error('Kết quả rỗng — sai key, IV, hoặc ciphertext bị hỏng.');
    return { plaintext };
  } catch (e) {
    return { error: 'Lỗi AES Decrypt: ' + e.message };
  }
}

// Tạo khóa AES ngẫu nhiên
function generateAESKey(bits = 256) {
  const bytes = bits / 8;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: bytes}, () =>
    chars[Math.floor(Math.random() * chars.length)]).join('');
}