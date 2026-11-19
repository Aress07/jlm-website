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
    createdAt: new Date(),
    locale: input.locale,
    idempotencyKey: input.idempotencyKey,
  });

  if (input.email) {
    await sendEmail({
      to: input.email,
      subject: confirmationSubject[input.locale] ?? confirmationSubject.fr,
      html: `<p>${reference}</p><p>${settings.bank.bankName} — ${settings.bank.holder}</p><p>RIB: ${settings.bank.rib}</p>`,
    });
  }

  return NextResponse.json({ reference });
}
