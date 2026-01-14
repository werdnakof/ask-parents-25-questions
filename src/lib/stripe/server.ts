import Stripe from 'stripe';

// Price ID for premium upgrade ($9.99 one-time)
export const PREMIUM_PRICE_ID = process.env.STRIPE_PRICE_ID || '';

// App URL for redirects
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Initialize Stripe only when needed (lazy initialization)
let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }

  return stripeInstance;
}
