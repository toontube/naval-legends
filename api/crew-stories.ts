import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, PUBLIC_COLUMNS } from '../src/lib/crew';

// GET /api/crew-stories?ship=Q1500182 -> approved entries for one ship
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ship = String(req.query.ship || '');
  if (!/^Q\d+$/.test(ship)) return res.status(400).json({ error: 'ship must be a Wikidata id' });

  try {
    const { data, error } = await db()
      .from('crew_stories')
      .select(PUBLIC_COLUMNS)
      .eq('ship_id', ship)
      .eq('status', 'approved')
      .order('created_at', { ascending: true })
      .limit(500);
    if (error) throw error;
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
    return res.status(200).json({ entries: data });
  } catch (err) {
    return res.status(503).json({ error: 'Crew list unavailable', entries: [] });
  }
}
