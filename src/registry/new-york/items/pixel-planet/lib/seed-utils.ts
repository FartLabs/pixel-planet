export function getSeedFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  // Generate a 5-digit seed (range: 10000 to 99999)
  // 5 digits provides 100k unique variations while staying within
  // GLSL float precision limits (32-bit floats have ~7 decimal digits of precision)
  const min5Digit = 10000;
  const max5Digit = 99999;
  const range = max5Digit - min5Digit + 1;

  return min5Digit + (Math.abs(hash) % range);
}
