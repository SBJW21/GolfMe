import Stripe from "stripe";
import { getCoach, sampleSlots } from "@/lib/data";
import { splitPayment } from "@/lib/pricing";

type Body = {
  slug: string;
  slot: string;
  name: string;
  email: string;
  phone: string;
};

function parseBody(value: unknown): Body | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  const fields = ["slug", "slot", "name", "email", "phone"] as const;
  for (const f of fields) {
    if (typeof v[f] !== "string" || (v[f] as string).trim() === "") return null;
  }
  return {
    slug: (v.slug as string).trim(),
    slot: (v.slot as string).trim(),
    name: (v.name as string).trim().slice(0, 120),
    email: (v.email as string).trim().slice(0, 200),
    phone: (v.phone as string).trim().slice(0, 40),
  };
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return Response.json(
      { error: "Please fill in your name, a valid email and your mobile." },
      { status: 400 },
    );
  }

  // Never trust the browser for price or availability: look both up on the server.
  const coach = getCoach(body.slug);
  const slotOk =
    coach && sampleSlots(coach.slug).some((s) => s.startsAt === body.slot);
  if (!coach || !slotOk) {
    return Response.json(
      { error: "That time is no longer available. Please choose another." },
      { status: 409 },
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return Response.json(
      { error: "Online payments are not switched on yet." },
      { status: 503 },
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const stripe = new Stripe(secret);
  const { feeCents, coachCents } = splitPayment(coach.priceCents);

  // The student pays the platform in full. The coach's share is transferred
  // later, in the monthly payout, once the lesson has happened.
  const metadata = {
    coach_slug: coach.slug,
    slot: body.slot,
    student_name: body.name,
    student_phone: body.phone,
    amount_cents: String(coach.priceCents),
    fee_cents: String(feeCents),
    coach_cents: String(coachCents),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: body.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aud",
          unit_amount: coach.priceCents,
          product_data: {
            name: `Golf lesson with ${coach.name}`,
            description: `${body.slot.replace("T", " ")} (60 minutes)`,
          },
        },
      },
    ],
    payment_intent_data: {
      transfer_group: `lesson_${coach.slug}_${body.slot}`,
      metadata,
    },
    metadata,
    success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/coaches/${coach.slug}`,
  });

  return Response.json({ url: session.url });
}
