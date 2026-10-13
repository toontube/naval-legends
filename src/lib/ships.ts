import { createHash } from 'node:crypto';
import shipsData from '../data/ships.json';

export interface Ship {
  id: string;
  slug: string;
  name: string;
  hull_number: string | null;
  navy: string | null;
  class: string | null;
  ship_type: string | null;
  commissioned: string | null;
  decommissioned: string | null;
  conflicts: string[];
  image_url: string | null;
  wikipedia_url: string | null;
  stories?: string[];
}

export const ships = shipsData as Ship[];

export const year = (d: string | null) => (d ? d.slice(0, 4) : null);

export const serviceYears = (s: Ship) => {
  const a = year(s.commissioned);
  const b = year(s.decommissioned);
  if (a && b) return `${a} to ${b}`;
  if (a) return `from ${a}`;
  return null;
};

// Wikimedia Commons: build the direct thumbnail URL (Special:FilePath costs three
// redirects per image). Path is /thumb/<md5[0]>/<md5[0..1]>/<File>/<width>px-<File>.
// Use Commons' standard widths (500, 960) so thumbnails come from cache.
export const commonsImage = (url: string | null, width: 500 | 960 = 960) => {
  if (!url) return null;
  const file = decodeURIComponent(url.split('Special:FilePath/')[1] || '').replace(/ /g, '_');
  if (!file) return null;
  const md5 = createHash('md5').update(file).digest('hex');
  const enc = encodeURIComponent(file);
  const thumb = `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5.slice(0, 2)}/${enc}/${width}px-${enc}`;
  // SVG thumbnails are rendered to PNG
  return file.toLowerCase().endsWith('.svg') ? `${thumb}.png` : thumb;
};
export const commonsPage = (url: string | null) => (url ? url.replace('Special:FilePath/', 'File:') : null);
