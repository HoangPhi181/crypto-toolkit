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