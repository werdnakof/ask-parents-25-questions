import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer, PREMIUM_PRICE_ID, APP_URL } from '@/lib/stripe/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user data using Admin SDK
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = userDoc.data()!;

    // Check if user is already premium
    if (userData.isPremium) {
      return NextResponse.json({ error: 'User is already premium' }, { status: 400 });
    }

    // Get or create Stripe customer
    const stripe = getStripeServer();
    let customerId = userData.stripeCustomerId as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email as string,
        name: userData.displayName as string,
        metadata: {
          firebaseUserId: userId,
        },
      });
      customerId = customer.id;

      // Save Stripe customer ID to user document using Admin SDK
      await adminDb.collection('users').doc(userId).update({
        stripeCustomerId: customerId,
      });
    }

    // Parse the request body for locale
    const body = await request.json().catch(() => ({}));
    const locale = body.locale || 'en';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${APP_URL}/${locale}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/${locale}/payment/cancelled`,
      metadata: {
        firebaseUserId: userId,
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
