// src/utils/crypto.ts
export async function sha256(input: string) {
  // This uses the Web Crypto API. Works in modern runtimes.
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
