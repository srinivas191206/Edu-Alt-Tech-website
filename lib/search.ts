export function normalizeSearch(term: string): string {
  return term.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function matchSearch(haystack: string, needle: string): boolean {
  const h = normalizeSearch(haystack);
  const n = normalizeSearch(needle);
  return h.includes(n);
}
