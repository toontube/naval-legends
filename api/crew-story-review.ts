import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, esc, sendEmail, validSignature } from '../src/lib/crew';

// GET /api/crew-story-review?id=..&action=approve|reject&sig=.. (link from the moderation email)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id || '');
  const action = String(req.query.action || '');
  const sig = String(req.query.sig || '');
  const page = (msg: string) =>
    res.status(200).setHeader('Content-Type', 'text/html').send(`<p style="font:16px system-ui;padding:2rem">${esc(msg)}</p>`);

  if (!['approve', 'reject'].includes(action) || !validSignature(id, action, sig)) {
    return res.status(403).send('Invalid or expired link');
  }

  const status = action === 'approve' ? 'approved' : 'rejected';
  const { data, error } = await db()
    .from('crew_stories')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('sailor_name, ship_name, ship_id, contributor_email, contributor_name')
    .single();
  if (error || !data) return page('Entry not found.');

  if (status === 'approved') {
    const site = process.env.SITE_URL || 'https://brvzulu.com';
    await sendEmail(
      data.contributor_email,
      `${data.sailor_name} is now on the ${data.ship_name} crew list`,
      `<p>${data.contributor_name ? `Hi ${esc(data.contributor_name)},` : 'Hello,'}</p>
       <p>${esc(data.sailor_name)} is now listed with the crew of ${esc(data.ship_name)} on Bravo Zulu.</p>
       <p><a href="${site}/ships/?id=${esc(data.ship_id)}">See the crew list and share it with your family</a></p>`,
    );
  }
  return page(`${data.sailor_name} (${data.ship_name}): ${status}.`);
}
