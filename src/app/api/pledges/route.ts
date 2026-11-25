import "server-only";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { pledgeInputSchema } from "@/lib/validation/schemas";
import { generatePledgeReference } from "@/lib/validation/reference";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { isRateLimited, clientIpFrom } from "@/lib/security/rate-limit";
import { sendEmail } from "@/lib/email/send";
import { getPublicSettings } from "@/lib/content/settings";
import { toMillis } from "@/lib/utils/firestore-date";
import { getStripeClient, isCardPaymentsEnabled } from "@/lib/payments/stripe";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const confirmationSubject: Record<string, string> = {
  fr: "Merci pour votre promesse de don — JLM ENSAM Casablanca",
  ar: "شكراً على تبرعكم — جيلام إنسام الدار البيضاء",
  en: "Thank you for your pledge — JLM ENSAM Casablanca",
};

export async function POST(request: Request) {
  const ip = clientIpFrom(request.headers);
  if (isRateLimited(`pledge:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = pledgeInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Honeypot: a real visitor never fills this field.
  if (input.website) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const settings = await getPublicSettings();
  if (!settings?.donationsEnabled) {
    return NextResponse.json(
      {
        error:
          "Donations are not open yet. Please use the contact form instead.",
      },
      { status: 403 },
    );
  }

  const minAmount = Number(process.env.PLEDGE_MIN_AMOUNT_MAD ?? "10");
  const maxAmount = Number(process.env.PLEDGE_MAX_AMOUNT_MAD ?? "50000");
  if (input.amountMAD < minAmount || input.amountMAD > maxAmount) {
    return NextResponse.json(
      { error: `Amount must be between ${minAmount} and ${maxAmount} MAD` },
      { status: 400 },
    );
  }

  const db = getAdminDb();

  const campaignDoc = await db
    .collection("campaigns")
    .doc(input.campaignSlug)
    .get();
  if (!campaignDoc.exists || campaignDoc.data()?.published !== true) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }
  const campaignData = campaignDoc.data()!;
  const endsAtMs = toMillis(campaignData.endsAt);
  if (endsAtMs !== null && endsAtMs < Date.now()) {
    return NextResponse.json(
      { error: "This campaign has ended" },
      { status: 409 },
    );
  }

  // Idempotency: a repeated key returns the existing pledge's reference
  // instead of creating a duplicate (master plan Section 8.5).
  const existing = await db
    .collection("pledges")
    .where("idempotencyKey", "==", input.idempotencyKey)
    .limit(1)
    .get();
  if (!existing.empty) {
    return NextResponse.json({ reference: existing.docs[0].data().reference });
  }

  if (input.paymentMethod === "card" && !isCardPaymentsEnabled()) {
    return NextResponse.json(
      { error: "Card payment is not configured" },
      { status: 400 },
    );
  }

  const verified = await verifyTurnstile(input.turnstileToken, ip);
  if (!verified) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 });
  }

  const reference = await generatePledgeReference(async (candidate) => {
    const snap = await db
      .collection("pledges")
      .where("reference", "==", candidate)
      .limit(1)
      .get();
    return !snap.empty;
  });

  const pledgeRef = db.collection("pledges").doc();
  await pledgeRef.set({
    reference,
    campaignSlug: input.campaignSlug,
    amountMAD: input.amountMAD,
    currencyDisplay: input.currencyDisplay,
    donorName: input.anonymous ? undefined : input.donorName,
    anonymous: input.anonymous,
    email: input.email,
    phone: input.phone,
    message: input.message,
    kind: input.kind,
    inKindDescription: input.inKindDescription,
    status: "pledged",
    paymentMethod: input.paymentMethod,
    createdAt: new Date(),
    locale: input.locale,
    idempotencyKey: input.idempotencyKey,
  });

  // Card is a Stripe Checkout test-mode redirect (see src/lib/payments/stripe.ts);
  // the pledge stays "pledged" until the webhook confirms payment.
  if (input.paymentMethod === "card") {
    const origin = new URL(request.url).origin;
    const currency = (process.env.STRIPE_CURRENCY ?? "mad").toLowerCase();
    const session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      allowed_payment_method_types: ["card"],
      customer_email: input.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(input.amountMAD * 100),
            product_data: { name: `JLM ENSAM — ${reference}` },
          },
        },
      ],
      success_url: `${origin}/${input.locale}/donate/thanks?ref=${encodeURIComponent(reference)}&campaign=${encodeURIComponent(input.campaignSlug)}&method=card`,
      cancel_url: `${origin}/${input.locale}/donate/${input.campaignSlug}`,
      metadata: { pledgeId: pledgeRef.id, reference },
    });
    await pledgeRef.update({
      paymentProvider: "stripe",
      stripeSessionId: session.id,
    });

    if (input.email) {
      await sendEmail({
        to: input.email,
        subject: confirmationSubject[input.locale] ?? confirmationSubject.fr,
        html: `<p>${reference}</p><p>Test-mode card payment — no real money is charged.</p>`,
      });
    }

    return NextResponse.json({ reference, checkoutUrl: session.url });
  }

  if (input.email) {
    await sendEmail({
      to: input.email,
      subject: confirmationSubject[input.locale] ?? confirmationSubject.fr,
      html: `<p>${reference}</p><p>${settings.bank.bankName} — ${settings.bank.holder}</p><p>RIB: ${settings.bank.rib}</p>`,
    });
  }

  return NextResponse.json({ reference });
}
