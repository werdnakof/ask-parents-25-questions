import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe/server';
import { updateUser } from '@/lib/firebase/firestore';

// Disable body parsing - we need the raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get the Firebase user ID from session metadata
        const firebaseUserId = session.metadata?.firebaseUserId;

        if (!firebaseUserId) {
          console.error('No firebaseUserId in session metadata');
          return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        // Update user's premium status in Firestore
        await updateUser(firebaseUserId, {
          isPremium: true,
        });

        console.log(`Successfully upgraded user ${firebaseUserId} to premium`);
        break;
      }

      case 'checkout.session.expired': {
        // Session expired without payment - no action needed
        console.log('Checkout session expired');
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error processing webhook: ${message}`);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
