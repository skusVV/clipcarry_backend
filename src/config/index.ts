import dotenv from 'dotenv';
import { IConfigs } from './config.interface';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error('Couldn\'t find .env file');
}

export const configs: IConfigs = {
  port: Number(process.env.PORT) || 3001,
  mongoURI: process.env.MONGO_URI || '',
  stripeSecret: process.env.STRIPE_SECRET || '',
  stripeProductPrice: process.env.STRIPE_PRODUCT_PRICE || '',

  token: {
    key: process.env.TOKEN_KEY || '',
    expTime: process.env.EXPIRATION_TIME || '',
    defaultExpTime: process.env.DEFAULT_USER_EXPIRATION_TIME || '',
  },

  guestUserPassword: process.env.GUEST_USER_PASSWORD || '',
  registrationPromoCode: process.env.REGISTRATION_PROMOCODE || '',
  landingUrl: process.env.LANDING_URL || '',

  sendgrid: {
    secret: process.env.SENDGRID_SECRET || '',
    email: process.env.SENDGRID_EMAIL || ''
  }
};