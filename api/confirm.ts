import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from '../src/lib/supabase';
import { verify } from '../src/lib/signing';

const SITE_URL = process.env.SITE_URL || 'https://brvzulu.com';
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = String(req.query.token ?? '');
  const payload = verify<{ email: string }>(token, { maxAgeSec: MAX_AGE_SEC });
  if (!payload?.email) {
    return res.status(400).send('Invalid or expired confirmation link.');
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('subscribers')
    .update({ confirmed_at: new Date().toISOString() })
    .eq('email', payload.email)
    .is('confirmed_at', null);

  if (error) return res.status(500).send('Could not confirm — try again shortly.');

  res.setHeader('Location', `${SITE_URL}/?confirmed=1`);
  return res.status(302).end();
}
