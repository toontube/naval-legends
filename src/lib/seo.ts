// Shared SEO helpers.

export const ORG = {
  '@type': 'Organization',
  '@id': 'https://brvzulu.com/#org',
  name: 'Bravo Zulu',
  url: 'https://brvzulu.com/',
  logo: { '@type': 'ImageObject', url: 'https://brvzulu.com/logo-512.png', width: 512, height: 512 },
  email: 'stories@bravozulu.co',
  parentOrganization: { '@type': 'Organization', name: 'MOZUMA', url: 'https://mozuma.co' },
  sameAs: ['https://mozuma.co', 'https://www.kickstarter.com/profile/mozuma'],
};

// Meta descriptions: whole sentences from the summary, up to 160 characters; word cut when that is too short.
export const metaDescription = (text: string, max = 160) => {
  if (text.length <= max) return text;
  let out = '';
  for (const s of text.match(/[^.!?]+[.!?]+["']?\s*/g) ?? []) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  // Too short after whole sentences: cut at a word boundary instead, so the snippet stays useful.
  return out.length >= 110 ? out : text.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
};
