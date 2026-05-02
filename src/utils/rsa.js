import JSEncrypt from 'jsencrypt';

/**
 * M4: RSA Asymmetric Encryption / Decryption
 * Key format: PEM
 */

let _lastPublicKey = '';
let _lastPrivateKey = '';

/**
 * Tạo cặp khóa RSA (Public + Private) dạng PEM
 */
export function generateRSAKeyPair(bits = 2048) {
    if (bits !== 1024 && bits !== 2048)
        return { error: 'RSA: Key size phải là 1024 hoặc 2048 bit.' };

    try {
        const crypt = new JSEncrypt({ default_key_size: bits });
        crypt.getKey(); // blocking — sinh khóa ngay
        _lastPublicKey = crypt.getPublicKey();
        _lastPrivateKey = crypt.getPrivateKey();

        if (!_lastPublicKey || !_lastPrivateKey)
            throw new Error('JSEncrypt trả về key rỗng.');

        return { publicKey: _lastPublicKey, privateKey: _lastPrivateKey, bits };
    } catch (e) {
        return { error: 'Tạo khóa RSA thất bại: ' + e.message };
    }
}

/**
 * Mã hóa bằng Public Key
 */
export function rsaEncrypt(plaintext, publicKeyPEM) {
    if (!plaintext) return { error: 'RSA: Plaintext không được để trống.' };
    if (!publicKeyPEM) return { error: 'RSA: Cần nhập Public Key (PEM format).' };

    // Kiểm tra sơ bộ PEM format
    if (!publicKeyPEM.includes('-----BEGIN'))
        return { error: 'RSA: Public Key không đúng định dạng PEM.\nCần có dòng -----BEGIN PUBLIC KEY-----' };

    // Cảnh báo plaintext quá dài (RSA-2048 limit ~245 bytes với PKCS#1 v1.5)
    const byteLen = new TextEncoder().encode(plaintext).length;
    if (byteLen > 200)
        return {
            error: `RSA: Plaintext quá dài (${byteLen} bytes).\n` +
                'RSA-2048 chỉ mã hóa tối đa ~200 bytes.\n' +
                'Gợi ý: Dùng AES để mã hóa dữ liệu lớn.'
        };

    try {
        const crypt = new JSEncrypt();
        crypt.setPublicKey(publicKeyPEM);
        const enc = crypt.encrypt(plaintext);
        if (!enc) throw new Error('encrypt() trả về false — Public Key không hợp lệ?');
        return { ciphertext: enc };  // Base64
    } catch (e) {
        return { error: 'RSA Encrypt thất bại: ' + e.message };
    }
}