import Stripe from "stripe";
import { lessonCountsAsDone, splitPayment } from "./pricing";

/**
 * Monthly coach payouts. NOT YET TESTED against Stripe: check the transfer flow in Stripe test mode
 * (and with an accountant) before paying real coaches.
 *
 * Flow: the student paid the platform at booking. Once a lesson counts as done, it is added to the
 * coach's next monthly payout. The payout is a Stripe transfer to the coach's connected account.
 */

export type PayableBooking = {
  id: string;
  amountCents: number;
  endsAt: Date;
  cancelled: boolean;
  disputed: boolean;
  alreadyPaid: boolean;
};

export function buildPayout(bookings: PayableBooking[], now: Date) {
  const eligible = bookings.filter(
    (b) =>
      !b.cancelled &&
      !b.alreadyPaid &&
      lessonCountsAsDone(b.endsAt, now, b.disputed),
  );

  let grossCents = 0;
  let feeCents = 0;
  for (const b of eligible) {
    grossCents += b.amountCents;
    feeCents += splitPayment(b.amountCents).feeCents;
  }

  return {
    bookingIds: eligible.map((b) => b.id),
    grossCents,
    feeCents,
    netCents: grossCents - feeCents,
  };
}

export async function sendCoachTransfer(
  stripe: Stripe,
  args: {
    coachStripeAccountId: string;
    netCents: number;
    payoutId: string;
  },
) {
  if (args.netCents <= 0) return null;
  return stripe.transfers.create({
    amount: args.netCents,
    currency: "aud",
    destination: args.coachStripeAccountId,
    metadata: { payout_id: args.payoutId },
  });
}
