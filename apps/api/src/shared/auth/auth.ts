import { betterAuth } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import { PostgresDialect } from 'kysely';
import { getEnv } from '../../config/env';
import { pgPool } from '../../data/postgres';
import { sendPasswordResetEmail, sendVerificationEmail } from '../email/send';

const env = getEnv();

export const auth = betterAuth({
  database: {
    dialect: new PostgresDialect({ pool: pgPool }),
    type: 'postgres',
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/auth/api',
  trustedOrigins: [env.FRONTEND_URL],
  plugins: [openAPI()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      sendPasswordResetEmail(user.email, url);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      sendVerificationEmail(user.email, url);
    },
  },
  session: {
    expiresIn: 2 * 60 * 60, // 2 hours (idle timeout)
    updateAge: 60 * 60, // extend on activity after 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});
