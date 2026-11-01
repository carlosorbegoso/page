export type SplitMode = 'words' | 'lines' | 'chars';

export interface SplitWord {
  text: string;
  chars: string[];
}

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

/** Grapheme-safe so accented letters and emoji are never cut in half. */
export function graphemes(word: string): string[] {
  if (!segmenter) return Array.from(word);
  return Array.from(segmenter.segment(word), part => part.segment);
}

export function splitWords(text: string): SplitWord[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => ({ text: word, chars: graphemes(word) }));
}

export interface CountPart {
  text: string;
  count?: number;
}

/** Splits a sentence so every figure followed by a percent sign ("30–40%", "30 % y 40 %") can count up. */
export function splitCounts(text: string): CountPart[] {
  const parts: CountPart[] = [];
  const pattern = /\d+(?=(?:\s?%)|(?:[–-]\d+\s?%))/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: text.slice(last, index) });
    parts.push({ text: match[0], count: Number(match[0]) });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
