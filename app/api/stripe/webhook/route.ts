import Stripe from "stripe";

/**
 * Stripe sends events here, for example when a lesson has been paid for.
 * Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, then add this URL as a webhook endpoint
 * in the Stripe dashboard: https://<your site>/api/stripe/webhook
 *
 * TODO once Supabase is connected: on checkout.session.completed, create the booking row
 * (status "confirmed") from the session metadata, then send the confirmation email.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return Response.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(secret);
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Lesson paid", session.id, session.metadata);
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
