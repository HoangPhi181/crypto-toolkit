// ================================================================
// js/hash.js  —  M5: Hash Functions — MD5 & SHA-256
// Thư viện: CryptoJS 4.2.0
// Hash là hàm một chiều — KHÔNG thể đảo ngược
// MD5  → 128-bit output (32 hex chars) — KHÔNG AN TOÀN
// SHA-256 → 256-bit output (64 hex chars) — KHUYẾN NGHỊ
// ================================================================

// ── MD5 ─────────────────────────────────────────────────────────
/**
 * Tính hash MD5 của chuỗi input
 * @param {string} input — Chuỗi bất kỳ (kể cả rỗng '')
 * @returns {{ hash, hexLen, bits, algo } | { error }}
 */
function hashMD5(input) {
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
/**
 * Tính hash SHA-256 của chuỗi input
 * @param {string} input
 * @returns {{ hash, hexLen, bits, algo } | { error }}
 */
function hashSHA256(input) {
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
/**
 * So sánh SHA-256 của 2 chuỗi — minh họa Avalanche Effect
 * @param {string} inputA
 * @param {string} inputB
 * @returns {{ hashA, hashB, match, diffBits, diffPercent }}
 */
function compareHashes(inputA, inputB) {
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
    // Avalanche Effect lý tưởng: ~50% bit thay đổi khi input thay đổi 1 ký tự
  };
}

// ── HELPER: kích thước input bằng bytes ─────────────────────────
function getByteSize(str) {
  return new TextEncoder().encode(str).length;
}

// ── KẾT NỐI VÀO UI ──────────────────────────────────────────────
// Gọi khi nhấn nút "Hash ngay" hoặc input thay đổi
function handleHash() {
  const input   = document.getElementById('hash-input')?.value ?? '';
  const md5El   = document.getElementById('hash-md5');
  const sha256El= document.getElementById('hash-sha256');
  const sizeEl  = document.getElementById('hash-size');

  if (sizeEl) sizeEl.textContent = getByteSize(input) + ' bytes';

  if (!input) {
    if (md5El)    md5El.innerHTML    = '<span class="empty">—</span>';
    if (sha256El) sha256El.innerHTML = '<span class="empty">—</span>';
    return;
  }

  const md5r = hashMD5(input);
  if (md5El) {
    md5El.className = 'output-box' + (md5r.error ? ' error' : '');
    md5El.textContent = md5r.error || md5r.hash;
  }

  const sha256r = hashSHA256(input);
  if (sha256El) {
    sha256El.className = 'output-box' + (sha256r.error ? ' error' : '');
    sha256El.textContent = sha256r.error || sha256r.hash;
  }
}

// So sánh realtime (gọi oninput từ HTML)
function handleCompareHash() {
  const a   = document.getElementById('cmp-a')?.value ?? '';
  const b   = document.getElementById('cmp-b')?.value ?? '';
  const el  = document.getElementById('cmp-result');
  if (!el) return;

  if (!a || !b) {
    el.style.color = 'var(--text3)';
    el.textContent = 'Nhập hai văn bản để so sánh...';
    return;
  }

  const r = compareHashes(a, b);
  if (r.match) {
    el.style.color = 'var(--success)';
    el.textContent = '✅ KHỚP — SHA-256 giống nhau → Nội dung hoàn toàn giống nhau.';
  } else {
    el.style.color = 'var(--danger)';
    el.textContent = `❌ KHÔNG KHỚP — ${r.diffBits}/256 bit khác nhau ` +
                     `(${r.diffPercent}%) — Avalanche Effect!`;
  }
}