import { Resend } from 'resend';
import { getEnv } from '../../config/env';

const env = getEnv();

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  if (resend) {
    try {
      await resend.emails.send({
        from: 'Muxlyn <noreply@muxlyn.app>',
        to,
        subject,
        text,
      });
    } catch (err) {
      console.error('[Email] Failed to send:', err);
    }
  } else {
    console.log(`[Email] STUB — To: ${to}, Subject: ${subject}`);
    console.log(`[Email] Body: ${text}`);
  }
}

export function sendVerificationEmail(to: string, url: string): void {
  sendEmail(to, 'Verify your email for Muxlyn', `Click the link to verify your email: ${url}`);
}

export function sendPasswordResetEmail(to: string, url: string): void {
  sendEmail(to, 'Reset your Muxlyn password', `Click the link to reset your password: ${url}`);
}
