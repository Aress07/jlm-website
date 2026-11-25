import "server-only";
import Stripe from "stripe";

/**
 * Card payments are test-mode-only (see docs/BACKLOG.md — real online payment
 * is release 2, and Stripe does not pay out to Moroccan bank accounts). The
 * feature is entirely gated on STRIPE_SECRET_KEY being set, so an unconfigured
 * deployment behaves exactly as before: bank-transfer pledges only.
 */
export function isCardPaymentsEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
