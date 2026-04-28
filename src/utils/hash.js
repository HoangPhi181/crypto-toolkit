import CryptoJS from 'crypto-js';

/**
 * M5: Hash Functions — MD5 & SHA-256
 * Hash là hàm một chiều — KHÔNG thể đảo ngược
 */

// ── MD5 ─────────────────────────────────────────────────────────
export function hashMD5(input) {
  if (input === undefined || input === null)
    return { error: 'MD5: Input không hợp lệ.' };
  try {
    const hash = CryptoJS.MD5(input).toString(); // hex string
    return {
      hash,
      hexLen : hash.length,         // luôn là 32
      bits   : 128,
      algo   : 'MD5'
    };
  } catch(e) { return { error: 'Lỗi MD5: ' + e.message }; }
}
