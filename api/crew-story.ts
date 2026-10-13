import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, esc, reviewUrl, sendEmail } from '../src/lib/crew';

const MODERATOR = process.env.CREW_MODERATOR_EMAIL || 'max@mozuma.co';

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

// Ask Jev (TypeSafe) whether the entry fits the ship. Advisory only: a person approves.
async function jevCheck(entry: Record<string, string>, ship: Record<string, string>) {
  const key = process.env.TYPESAFE_API_KEY;
  if (!key) return null;
  const questions = {
    dates_fit: {
      type: 'noul',
      instructions: 'Could the sailor in `entry` have served on `ship` during the years given in `entry.served`? Approximate or uncertain years count as fitting if they overlap the ship\'s service.',
      criteria: { true: 'Years overlap the ship\'s service or are too vague to rule out', false: 'Years clearly fall outside the ship\'s service' },
    },
    on_topic: {
      type: 'noul',
      instructions: 'Is `entry` a sincere entry about a real person who served aboard a ship, written by someone who knew of them?',
      criteria: { true: 'A sincere service entry', false: 'Spam, advertising, a joke, abuse or unrelated text' },
    },
  };
  try {
    const r = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'jev-latest', state: { entry, ship }, questions }),
    });
    if (!r.ok) return null;
    const { answers } = await r.json();
    return { dates_fit: answers.dates_fit?.noul, on_topic: answers.on_topic?.noul };
  } catch {
    return null;
  }
}

// POST /api/crew-story -> saved as pending, moderator emailed
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot: bots fill every field

  const entry = {
    ship_id: clip(b.ship_id, 20),
    ship_name: clip(b.ship_name, 160),
    sailor_name: clip(b.sailor_name, 120),
    served: clip(b.served, 80),
    relation: clip(b.relation, 60),
    rate: clip(b.rate, 80) || null,
    moment: clip(b.moment, 1500) || null,
    contributor_name: clip(b.contributor_name, 120) || null,
    contributor_email: clip(b.contributor_email, 200),
    contact_ok: b.contact_ok === true,
  };

  if (!/^Q\d+$/.test(entry.ship_id) || !entry.ship_name) return res.status(400).json({ error: 'Unknown ship' });
  if (!entry.sailor_name || !entry.served || !entry.relation)
    return res.status(400).json({ error: 'Please fill in their name, when they served, and how you are related.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.contributor_email))
    return res.status(400).json({ error: 'Please enter a valid email so we can tell you when it is live.' });
  if (b.consent !== true) return res.status(400).json({ error: 'Please confirm the entry can be shown publicly.' });

  const ship = {
    name: entry.ship_name,
    commissioned: clip(b.ship_commissioned, 10),
    decommissioned: clip(b.ship_decommissioned, 10),
  };
  const jev = await jevCheck(
    { sailor_name: entry.sailor_name, served: entry.served, rate: entry.rate || '', relation: entry.relation, moment: entry.moment || '' },
    ship,
  );

  try {
    const { data, error } = await db().from('crew_stories').insert({ ...entry, jev_check: jev }).select('id').single();
    if (error) throw error;

    const flags = jev
      ? `Jev: dates fit ${Math.round((jev.dates_fit ?? 0) * 100)}%, sincere entry ${Math.round((jev.on_topic ?? 0) * 100)}%`
      : 'Jev check unavailable';
    await sendEmail(
      MODERATOR,
      `New crew entry: ${entry.sailor_name}, ${entry.ship_name}`,
      `<p><b>${esc(entry.sailor_name)}</b>, ${esc(entry.served)}${entry.rate ? `, ${esc(entry.rate)}` : ''}<br>
       ${esc(entry.ship_name)} (ship ${esc(ship.commissioned)} to ${esc(ship.decommissioned)})<br>
       Relation: ${esc(entry.relation)}<br>From: ${esc(entry.contributor_name || '')} &lt;${esc(entry.contributor_email)}&gt;</p>
       ${entry.moment ? `<blockquote>${esc(entry.moment)}</blockquote>` : ''}
       <p>${esc(flags)}</p>
       <p><a href="${reviewUrl(data.id, 'approve')}">Approve</a> &nbsp; <a href="${reviewUrl(data.id, 'reject')}">Reject</a></p>`,
    );
    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: 'Could not save your entry. Please try again in a minute.' });
  }
}
