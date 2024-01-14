import * as CryptoJS from 'crypto-js';

const keyEncode = 'Zq4t7w!z%C*F-JaNcRfUjXn2r5u8x/A?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQfT';

export class SecurityUtil {
    static set(text: string): string | null {
        try {
            return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text.toString()), keyEncode).toString();
        } catch (e) {
            return null;
        }
    }

    /**
     * Decrypts key
     * @param text
     * @returns
     */
    static get(text: string): string | null {
        try {
            return CryptoJS.AES.decrypt(text, keyEncode).toString(CryptoJS.enc.Utf8);
        } catch (e) {
            return null;
        }
    }

    static generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            // eslint-disable-next-line no-bitwise
            const r = (Math.random() * 16) | 0;
            // eslint-disable-next-line no-bitwise
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    static generateSHA256(code: string): string {
        return CryptoJS.SHA256(code).toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
}
