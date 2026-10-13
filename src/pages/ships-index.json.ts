import { ships, year } from '../lib/ships';

// Compact search index for /ships: [id, slug, name, hull, navy, from, to]
export function GET() {
  const rows = ships.map((s) => [s.id, s.slug, s.name, s.hull_number || '', s.navy || '', year(s.commissioned) || '', year(s.decommissioned) || '']);
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
}
