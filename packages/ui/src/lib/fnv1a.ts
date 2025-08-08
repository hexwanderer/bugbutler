/** biome-ignore-all lint/nursery/noBitwiseOperators: hashing algorithm */
export function fnv1a(str: string): number {
  let h = 0x81_1c_9d_c5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    // multiply by FNV prime
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h;
}
