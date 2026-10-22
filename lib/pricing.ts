/**
 * Money and lesson rules for Golf Me.
 * All amounts are in cents (AUD).
 *
 * Rules agreed so far:
 * - The platform takes 15% of each booking.
 * - Students pay in full at booking. Coaches are paid monthly for lessons that have happened.
 * - Cancelling 24 hours or more before the lesson gives the full amount back as account credit
 *   (not cash), valid for 6 months with any coach. Inside 24 hours there is no credit and the coach still earns their share.
 * - A lesson counts as done automatically a set time after it ends, unless the student disputes it.
 *
 * Later: the fee may drop after a student's 6th lesson with the same coach.
 */

export const PLATFORM_FEE_RATE = 0.15;
export const FREE_CANCELLATION_HOURS = 24;
/** Account credit from a cancellation can be used with any coach until it expires. */
export const CREDIT_VALID_MONTHS = 6;
/** Hours after a lesson ends before it counts as done, if not disputed */
export const AUTO_COMPLETE_HOURS = 24;

export function splitPayment(amountCents: number) {
  const feeCents = Math.round(amountCents * PLATFORM_FEE_RATE);
  return { feeCents, coachCents: amountCents - feeCents };
}

export function formatAud(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function hoursBetween(from: Date, to: Date) {
  return (to.getTime() - from.getTime()) / 3_600_000;
}

/** What happens to the money if a student cancels. Early cancellations become account credit. */
export function cancellationOutcome(
  startsAt: Date,
  cancelledAt: Date,
  amountCents: number,
) {
  const early = hoursBetween(cancelledAt, startsAt) >= FREE_CANCELLATION_HOURS;
  if (early) {
    return { creditCents: amountCents, coachKeepsCents: 0, platformKeepsCents: 0 };
  }
  const { feeCents, coachCents } = splitPayment(amountCents);
  return {
    creditCents: 0,
    coachKeepsCents: coachCents,
    platformKeepsCents: feeCents,
  };
}

/** True once a lesson can be included in a monthly payout. */
export function lessonCountsAsDone(
  endsAt: Date,
  now: Date,
  disputed: boolean,
) {
  return !disputed && hoursBetween(endsAt, now) >= AUTO_COMPLETE_HOURS;
}
