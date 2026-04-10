/**
 * Section labels from API are often ALL CAPS; convert to sentence case.
 * Mixed-case strings (e.g. headings from `meta.heading`) are left as-is.
 */
export function displayLabel(value) {
  if (value == null || value === "") return null;
  const s = String(value).trim();
  if (!s) return null;
  const letters = s.replace(/[^a-zA-Z]/g, "");
  if (letters.length && letters === letters.toUpperCase() && /[A-Z]/.test(letters)) {
    return sentenceCaseLine(s);
  }
  return s;
}

/** First character uppercase, rest lowercase (single phrase / line). */
export function sentenceCaseLine(value) {
  if (value == null || value === "") return value;
  const s = String(value).trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Sentence-case each sentence (split after . ! ?).
 * Keeps spacing roughly similar to the original.
 */
export function sentenceCaseParagraph(value) {
  if (value == null || value === "") return value;
  const s = String(value).replace(/\s+/g, " ").trim();
  if (!s) return s;
  return s
    .split(/(?<=[.!?])\s+/)
    .map((part) => sentenceCaseLine(part))
    .join(" ");
}
