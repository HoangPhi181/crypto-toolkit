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


// ── SHA-256 ─────────────────────────────────────────────────────
export function hashSHA256(input) {
  if (input === undefined || input === null)
    return { error: 'SHA-256: Input không hợp lệ.' };
  try {
    const hash = CryptoJS.SHA256(input).toString();
    return {
      hash,
      hexLen : hash.length,         // luôn là 64
      bits   : 256,
      algo   : 'SHA-256'
    };
  } catch(e) { return { error: 'Lỗi SHA-256: ' + e.message }; }
}

// ── SO SÁNH HASH (Kiểm tra toàn vẹn dữ liệu) ───────────────────
export function compareHashes(inputA, inputB) {
  const hashA = CryptoJS.SHA256(inputA).toString();
  const hashB = CryptoJS.SHA256(inputB).toString();

  // Đếm số bit khác nhau (Hamming distance) → minh họa Avalanche
  let diffBits = 0;
  for (let i = 0; i < hashA.length; i++) {
    let xor = parseInt(hashA[i], 16) ^ parseInt(hashB[i], 16);
    while (xor) { diffBits += xor & 1; xor >>= 1; }
  }

  return {
    hashA,
    hashB,
    match       : hashA === hashB,
    diffBits,
    totalBits   : 256,
    diffPercent : ((diffBits / 256) * 100).toFixed(1)
  };
}

// ── HELPER: kích thước input bằng bytes ─────────────────────────
export function getByteSize(str) {
  return new TextEncoder().encode(str).length;
}
