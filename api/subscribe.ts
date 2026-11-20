import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from '../src/lib/supabase';
import { getResend, DISPATCH_SENDER } from '../src/lib/resend';
import { sign } from '../src/lib/signing';

const SITE_URL = process.env.SITE_URL || 'https://brvzulu.com';

function normEmail(raw: unknown): string {
  return String(raw ?? '').trim().toLowerCase();
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function newRefCode(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Honeypot — reject silently. Any bot that fills a hidden field gets a 200 with no side effects.
  if (req.body?.hp) return res.status(200).json({ ok: true, status: 'noop' });

  const email = normEmail(req.body?.email);
  const source = String(req.body?.source ?? 'unknown').slice(0, 64);
  const referredBy = req.body?.ref ? String(req.body.ref).slice(0, 32) : null;

  if (!isEmail(email)) return res.status(400).json({ error: 'Invalid email' });

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, confirmed_at, ref_code')
    .eq('email', email)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from('subscribers').insert({
      email,
      source,
      ref_code: newRefCode(),
      referred_by: referredBy,
    });
    if (error) return res.status(500).json({ error: 'Insert failed' });
  }

  if (existing?.confirmed_at) {
    return res.status(200).json({ ok: true, status: 'already_confirmed' });
  }

  const token = sign({ email, iat: Math.floor(Date.now() / 1000) });
  const confirmUrl = `${SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: DISPATCH_SENDER,
      to: email,
      subject: 'Confirm your subscription — Bravo Zulu',
      text: [
        'One click to confirm your spot on the Workshop Dispatch:',
        '',
        confirmUrl,
        '',
        'If you did not sign up, ignore this email.',
        '',
        'Bravo Zulu',
        'brvzulu.com',
      ].join('\n'),
    });
  } catch (err) {
    console.error('confirm-send-failed', err);
    // Non-fatal — row exists; can be re-confirmed later.
  }

  return res.status(200).json({ ok: true, status: 'pending_confirm' });
}
