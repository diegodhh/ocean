/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface EnvVars {
  /**
   * google client secret is missing
   */
  CLIENT_SECRET: string;
  DATABASE_URL?: any;
  /**
   * google client id
   */
  GOOGLE_CLIENT_ID: string;
  /**
   * minutes after which access tokens expire
   */
  JWT_ACCESS_EXPIRATION_MINUTES?: number;
  /**
   * days after which refresh tokens expire
   */
  JWT_REFRESH_EXPIRATION_DAYS?: number;
  /**
   * minutes after which reset password token expires
   */
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES?: number;
  /**
   * JWT secret key
   */
  JWT_SECRET: string;
  /**
   * minutes after which verify email token expires
   */
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES?: number;
  NODE_ENV: 'production' | 'development' | 'test';
  PORT?: number;
  REDIS_URL?: any;
  /**
   * Unknown Property
   */
  [x: string]: any;
}
