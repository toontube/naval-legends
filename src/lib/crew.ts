import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const PUBLIC_COLUMNS = 'id, ship_id, sailor_name, served, relation, rate, moment, contributor_name, created_at';

export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');
  return createClient(url, key, { auth: { persistSession: false } });
}

// Signed approve/reject links for the moderation email
function sign(id: string, action: string) {
  const secret = process.env.CREW_SIGNING_SECRET;
  if (!secret) throw new Error('CREW_SIGNING_SECRET missing');
  return createHmac('sha256', secret).update(`${id}:${action}`).digest('hex');
}

export function reviewUrl(id: string, action: 'approve' | 'reject') {
  const site = process.env.SITE_URL || 'https://brvzulu.com';
  return `${site}/api/crew-story-review?id=${id}&action=${action}&sig=${sign(id, action)}`;
}

export function validSignature(id: string, action: string, sig: string) {
  const expected = Buffer.from(sign(id, action));
  const given = Buffer.from(sig || '');
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CREW_SENDER || 'Bravo Zulu <crew@brvzulu.com>';
  if (!key) return false; // email not set up yet: entries still wait in the database
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });
  return r.ok;
}

export const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
