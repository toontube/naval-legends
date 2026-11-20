import crypto from 'node:crypto';

// HMAC-SHA256 tokens for confirm + unsubscribe links.
// Rotating SIGNING_SECRET invalidates ALL outstanding tokens — do so on suspected leak.

function requireSecret(): string {
  const s = process.env.SIGNING_SECRET;
  if (!s) throw new Error('SIGNING_SECRET missing');
  return s;
}

export function sign(payload: object): string {
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const s = crypto.createHmac('sha256', requireSecret()).update(p).digest('base64url');
  return `${p}.${s}`;
}

export function verify<T = Record<string, unknown>>(
  token: string,
  opts?: { maxAgeSec?: number },
): (T & { iat?: number }) | null {
  const [p, s] = String(token).split('.');
  if (!p || !s) return null;

  const expected = crypto.createHmac('sha256', requireSecret()).update(p).digest('base64url');
  const a = Buffer.from(s);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let parsed: T & { iat?: number };
  try {
    parsed = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (opts?.maxAgeSec && parsed.iat && Date.now() / 1000 - parsed.iat > opts.maxAgeSec) return null;
  return parsed;
}
