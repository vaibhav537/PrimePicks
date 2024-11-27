import CryptoJS from "crypto-js";

const SECRET_KEY: string = process.env.CRYPTO_KEY || "fallback-secret-key";

export const encrypter = (data: string): string | null => {
  try {
    const cipherText = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return encodeURIComponent(cipherText);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const decrypter = (cipherText: string): string | null => {
  try {
    const decodedCipherText = decodeURIComponent(cipherText);
    const bytes = CryptoJS.AES.decrypt(decodedCipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error(err);
    return null;
  }
};
