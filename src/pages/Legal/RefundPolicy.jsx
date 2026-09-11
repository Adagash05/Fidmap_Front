import LegalPage from "./LegalPage";
import { SUPPORT_EMAIL } from "../../constants/legal";

const RefundPolicy = () => (
  <LegalPage title="Refund Policy" pageTitle="Refund Policy | FIDMAP">
    <p>
      This Refund Policy explains how refunds work for FIDMAP's
      subscription plans and one-time Lifetime purchase. It's intended to
      be commercially reasonable for both customers and a small,
      self-funded SaaS product. It supplements our{" "}
      <a href="/terms">Terms of Service</a>.
    </p>

    <h2>1. Free Trial</h2>
    <p>
      New workspaces can start on a free trial of the Startup plan without
      entering payment details. Since no payment is taken during the
      trial, there is nothing to refund until you choose to subscribe.
    </p>

    <h2>2. Startup and Business Subscriptions</h2>
    <p>
      Startup and Business plans are billed in advance, monthly or
      yearly, through Paddle. Because you can cancel at any time and your
      access continues until the end of the period you already paid for
      (see "Cancellation" below), we generally do not provide prorated
      refunds for the unused portion of a billing period.
    </p>
    <p>
      If you were charged in error, were charged after a cancellation
      that should have taken effect, or believe a charge was otherwise
      incorrect, contact us at{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we will
      review it.
    </p>

    <h2>3. Lifetime Purchases</h2>
    <p>
      The Lifetime plan is a one-time purchase. Because it grants ongoing
      access rather than a recurring charge, we evaluate Lifetime refund
      requests case by case, generally within a short window after
      purchase (for example, if you purchased by mistake or the plan does
      not fit your needs shortly after buying it). Contact us at{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> as soon as
      possible if you'd like to request one.
    </p>

    <h2>4. Cancellation</h2>
    <p>
      You can cancel a recurring subscription at any time from your
      workspace's billing settings. Cancellation stops future billing;
      your plan remains active until the end of the period you already
      paid for, after which your workspace moves to a free/limited state
      rather than being deleted.
    </p>

    <h2>5. When Refunds May Not Be Available</h2>
    <p>Refunds are generally not available where:</p>
    <ul>
      <li>
        The request is for a partial or unused portion of a subscription
        period you cancelled partway through;
      </li>
      <li>
        Significant time has passed since the charge, such that a refund
        is no longer reasonably practical to process; or
      </li>
      <li>
        The account was suspended or terminated for violating our{" "}
        <a href="/terms">Terms of Service</a>.
      </li>
    </ul>

    <h2>6. How to Request a Refund</h2>
    <p>
      Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with
      the email address on your account and a brief description of the
      issue. We aim to respond to refund requests promptly.
    </p>

    <h2>7. Refund Processing</h2>
    <p>
      Approved refunds are processed by Paddle, our payment provider, back
      to your original payment method. Processing times can vary by
      payment method and bank, typically appearing within a normal
      billing cycle after approval.
    </p>

    <h2>8. Exceptions</h2>
    <p>
      Nothing in this policy limits any refund or cancellation right you
      may have under applicable consumer protection law, which takes
      precedence over this policy where it applies.
    </p>

    <h2>9. Contact</h2>
    <p>
      Questions about this Refund Policy can be sent to{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
    </p>
  </LegalPage>
);

export default RefundPolicy;
