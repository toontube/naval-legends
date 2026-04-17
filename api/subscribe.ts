import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHEET_URL = process.env.SUBSCRIBE_SHEET_URL || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email, source } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  try {
    // Send to Google Sheet via Apps Script
    if (SHEET_URL) {
      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: source || 'unknown',
          date: new Date().toISOString(),
        }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to save' });
  }
}
