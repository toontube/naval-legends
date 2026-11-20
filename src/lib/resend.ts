import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY;

export function getResend(): Resend {
  if (!key) throw new Error('RESEND_API_KEY missing');
  return new Resend(key);
}

export const DISPATCH_SENDER =
  process.env.DISPATCH_SENDER_EMAIL ||
  'Bravo Zulu — Workshop Dispatch <dispatch@brvzulu.com>';
