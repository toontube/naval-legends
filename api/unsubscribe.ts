import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from '../src/lib/supabase';
import { verify } from '../src/lib/signing';

const SITE_URL = process.env.SITE_URL || 'https://brvzulu.com';

// One-click unsubscribe. Gmail/Outlook 2024 List-Unsubscribe=One-Click sends POST.
// Human-clicked link sends GET → 302 to a friendly page.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = String(req.query.token ?? req.body?.token ?? '');
  const payload = verify<{ email: string }>(token);
  if (!payload?.email) return res.status(400).send('Invalid link.');

  const supabase = getSupabase();
  const { error } = await supabase
    .from('subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('email', payload.email);

  if (error) return res.status(500).send('Could not process — try again shortly.');

  if (req.method === 'POST') return res.status(200).json({ ok: true });
  res.setHeader('Location', `${SITE_URL}/?unsubscribed=1`);
  return res.status(302).end();
}
