// Story tags are slugs ("royal-navy"); show them as labels ("Royal Navy").
const ACRONYMS = new Set(['wwi', 'wwii', 'us', 'uss', 'hms', 'ijn', 'usn', 'rn', 'uk']);

export const tagLabel = (tag: string) =>
  tag
    .split('-')
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
