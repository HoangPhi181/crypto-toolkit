import CryptoJS from 'crypto-js';

// ── VALIDATE HELPERS ────────────────────────────────────────────
export function validateDESKey(key) {
    if (!key || key.trim() === '') return 'DES: Khóa không được để trống.';
    if (key.length !== 8)
        return `DES: Khóa phải đúng 8 ký tự (64-bit, 56-bit hiệu dụng).\n` +
            `→ Hiện tại: ${key.length} ký tự.`;
    return null;
}

export function validate3DESKey(key) {
    if (!key || key.trim() === '') return '3DES: Khóa không được để trống.';
    if (key.length !== 24)
        return `3DES: Khóa phải đúng 24 ký tự (192-bit, 168-bit hiệu dụng).\n` +
            `→ Hiện tại: ${key.length} ký tự.`;
    return null;
}

// ── DES ENCRYPT ─────────────────────────────────────────────────
export function desEncrypt(plaintext, key, ivHex = '') {
    const err = validateDESKey(key);
    if (err) return { error: err };
    if (!plaintext) return { error: 'DES: Plaintext không được để trống.' };

    try {
        const keyWA = CryptoJS.enc.Utf8.parse(key);
        const iv = ivHex && ivHex.length === 16
            ? CryptoJS.enc.Hex.parse(ivHex)
            : CryptoJS.lib.WordArray.random(8);
        const usedIV = iv.toString(CryptoJS.enc.Hex);
        const cfg = { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
        const enc = CryptoJS.DES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), keyWA, cfg);
        return {
            ciphertext: enc.toString(),
            iv: usedIV,
            algo: 'DES-CBC',
            keyBits: 64
        };
    } catch (e) { return { error: 'DES Encrypt thất bại: ' + e.message }; }
}

// ── DES DECRYPT ─────────────────────────────────────────────────
export function desDecrypt(ciphertext, key, ivHex) {
    const err = validateDESKey(key);
    if (err) return { error: err };
    if (!ciphertext) return { error: 'DES: Ciphertext không được để trống.' };
    if (!ivHex) return { error: 'DES-CBC Decrypt: Cần nhập IV (lấy từ khi mã hóa).' };

    try {
        const keyWA = CryptoJS.enc.Utf8.parse(key);
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const dec = CryptoJS.DES.decrypt(ciphertext, keyWA,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const plain = dec.toString(CryptoJS.enc.Utf8);
        if (!plain) throw new Error('Kết quả rỗng — sai Key hoặc IV.');
        return { plaintext: plain };
    } catch (e) { return { error: 'DES Decrypt thất bại: ' + e.message }; }
}

// ── 3DES ENCRYPT ────────────────────────────────────────────────
export function tripleDESEncrypt(plaintext, key, ivHex = '') {
    const err = validate3DESKey(key);
    if (err) return { error: err };
    if (!plaintext) return { error: '3DES: Plaintext không được để trống.' };

    try {
        const keyWA = CryptoJS.enc.Utf8.parse(key);
        const iv = ivHex && ivHex.length === 16
            ? CryptoJS.enc.Hex.parse(ivHex)
            : CryptoJS.lib.WordArray.random(8);
        const usedIV = iv.toString(CryptoJS.enc.Hex);
        const cfg = { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
        const enc = CryptoJS.TripleDES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), keyWA, cfg);
        return {
            ciphertext: enc.toString(),
            iv: usedIV,
            algo: '3DES-CBC',
            keyBits: 192
        };
    } catch (e) { return { error: '3DES Encrypt thất bại: ' + e.message }; }
}

// ── 3DES DECRYPT ────────────────────────────────────────────────
export function tripleDESDecrypt(ciphertext, key, ivHex) {
    const err = validate3DESKey(key);
    if (err) return { error: err };
    if (!ciphertext) return { error: '3DES: Ciphertext không được để trống.' };
    if (!ivHex) return { error: '3DES-CBC Decrypt: Cần nhập IV.' };

    try {
        const keyWA = CryptoJS.enc.Utf8.parse(key);
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const dec = CryptoJS.TripleDES.decrypt(ciphertext, keyWA,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const plain = dec.toString(CryptoJS.enc.Utf8);
        if (!plain) throw new Error('Kết quả rỗng — sai Key hoặc IV.');
        return { plaintext: plain };
    } catch (e) { return { error: '3DES Decrypt thất bại: ' + e.message }; }
}

// ── AUTO-GENERATE KEYS ───────────────────────────────────────────
export function generateDESKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
export function generate3DESKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
