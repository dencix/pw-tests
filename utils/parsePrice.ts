export function parsePrice(text: string): number {
  const clean = text.replace(/Rs\.?\s*/i, "").replace(/[,\s]/g, "");
  return parseInt(clean, 10) || 0;
}
