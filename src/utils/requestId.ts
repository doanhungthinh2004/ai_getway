import crypto from 'crypto';

export function generateRequestId(): string {
  return crypto.randomBytes(8).toString('hex');
}
