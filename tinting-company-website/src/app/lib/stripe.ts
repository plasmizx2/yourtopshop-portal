import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder';

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

// The API base URL — in dev, the backend runs on port 3001
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

interface CheckoutParams {
  service: string;
  price: string;
  date: string;
  time: string;
}

/**
 * Creates a Stripe Checkout Session on the backend and redirects to the payment page.
 */
export const handleStripeCheckout = async ({ service, price, date, time }: CheckoutParams) => {
  try {
    const currentOrigin = window.location.origin;

    const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service,
        price,
        date,
        time,
        successUrl: `${currentOrigin}/book-service?success=true&service=${encodeURIComponent(service)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
        cancelUrl: `${currentOrigin}/book-service?canceled=true`,
      }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('No checkout URL returned:', data);
      alert('There was an issue creating the checkout session. Please try again.');
    }
  } catch (err) {
    console.error('Stripe checkout error:', err);
    alert('Unable to connect to the payment server. Please try again in a moment.');
  }
};

/**
 * Logs a manual booking (Venmo/CashApp) to the admin portal.
 */
export const logManualBooking = async (params: {
  service: string;
  date: string;
  time: string;
  price: string;
  method: string;
  customerName?: string;
}) => {
  try {
    await fetch(`${API_BASE}/api/manual-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch (err) {
    console.error('Failed to log manual booking:', err);
  }
};
