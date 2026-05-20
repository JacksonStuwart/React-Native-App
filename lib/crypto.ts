import CryptoJS from "crypto-js";

const VERIFIER_PLAINTEXT = "atlas-vault-ok";

export function encrypt(plaintext: string, key: string): string {
  return CryptoJS.AES.encrypt(plaintext, key).toString();
}

export function decrypt(ciphertext: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}

export function makeVerifier(key: string): string {
  return encrypt(VERIFIER_PLAINTEXT, key);
}

export function checkVerifier(ciphertext: string, key: string): boolean {
  return decrypt(ciphertext, key) === VERIFIER_PLAINTEXT;
}

export function generatePassword(opts: {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~";

  let charset = "";
  if (opts.upper) charset += upper;
  if (opts.lower) charset += lower;
  if (opts.numbers) charset += numbers;
  if (opts.symbols) charset += symbols;
  if (!charset) charset = lower + numbers;

  const array = new Uint32Array(opts.length);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 0xffffffff);
  }

  let out = "";
  for (let i = 0; i < opts.length; i++) {
    out += charset[array[i] % charset.length];
  }
  return out;
}
