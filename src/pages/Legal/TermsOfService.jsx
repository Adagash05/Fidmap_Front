import LegalPage from "./LegalPage";
import { SUPPORT_EMAIL } from "../../constants/legal";

const TermsOfService = () => (
  <LegalPage title="Terms of Service" pageTitle="Terms of Service | FIDMAP">
    <p>
      These Terms of Service ("Terms") govern your access to and use of
      FIDMAP, a hosted software service for collecting, organizing, voting
      on, and managing customer feedback and feature requests ("FIDMAP",
      "the Service"). By creating a workspace, registering an account, or
      otherwise using the Service, you agree to these Terms. If you are
      using FIDMAP on behalf of an organization, you are agreeing on that
      organization's behalf and confirming you have the authority to do
      so.
    </p>

    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using FIDMAP, you agree to be bound by these Terms
      and by our{" "}
      <a href="/privacy">Privacy Policy</a> and{" "}
      <a href="/refund-policy">Refund Policy</a>, which are incorporated
      here by reference. If you do not agree, do not use the Service.
    </p>

    <h2>2. Description of FIDMAP</h2>
    <p>
      FIDMAP lets a team ("workspace") collect feedback and feature
      requests on boards, let end users vote and comment on that feedback,
      plan a public roadmap, and publish a changelog of what has shipped.
      Each workspace can optionally expose a public portal where its own
      customers can view and interact with its boards, roadmap, and
      changelog.
    </p>

    <h2>3. Account Registration</h2>
    <p>
      To use FIDMAP as a staff user, you must register an account with an
      accurate name and email address. You are responsible for maintaining
      the confidentiality of your login credentials and for all activity
      under your account. Notify us promptly at{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> if you
      believe your account has been compromised.
    </p>
    <p>
      The person who registers a workspace is its owner. Workspace owners
      can invite additional team members and set a temporary password for
      them directly inside the product. If you are added to a workspace by
      its owner, you are responsible for securing the credentials given to
      you and should change your temporary password after first signing
      in.
    </p>

    <h2>4. Workspace and User Responsibilities</h2>
    <p>
      Workspace owners are responsible for the conduct of the team members
      they add to a workspace and for ensuring those members comply with
      these Terms. You are responsible for the accuracy of the content
      your workspace publishes, including boards, roadmap items, and
      changelog entries.
    </p>

    <h2>5. Acceptable Use</h2>
    <p>You agree not to use FIDMAP to:</p>
    <ul>
      <li>Violate any applicable law or regulation;</li>
      <li>
        Post content that is unlawful, defamatory, harassing, or infringes
        on the rights of others;
      </li>
      <li>
        Attempt to gain unauthorized access to another workspace, account,
        or to the Service's underlying systems;
      </li>
      <li>
        Interfere with or disrupt the integrity or performance of the
        Service, including through automated scraping or excessive
        request volume;
      </li>
      <li>
        Use the Service to distribute malware, spam, or unsolicited
        communications; or
      </li>
      <li>
        Reverse engineer or attempt to extract the source code of the
        Service, except where applicable law permits it.
      </li>
    </ul>

    <h2>6. Customer Content</h2>
    <p>
      "Customer Content" means the boards, feedback posts, roadmap items,
      changelog entries, and other content your workspace creates or
      uploads to FIDMAP. You retain ownership of your Customer Content. You
      grant FIDMAP a limited license to host, store, display, and process
      Customer Content solely as necessary to provide and support the
      Service, including displaying it on any public portal your workspace
      chooses to enable.
    </p>
    <p>
      You are responsible for having the necessary rights to any content
      you submit and for ensuring it does not violate these Terms or
      applicable law.
    </p>

    <h2>7. Feedback and Public Content</h2>
    <p>
      Feedback posts, votes, and comments submitted by your end users
      through a public board or portal may be visible to other visitors of
      that workspace's portal, depending on how the workspace is
      configured. Do not enable public visibility for boards containing
      information you do not intend to make public.
    </p>

    <h2>8. Intellectual Property</h2>
    <p>
      FIDMAP and its underlying software, design, and branding are owned
      by us or our licensors and are protected by intellectual property
      laws. These Terms do not grant you any right to use FIDMAP's
      trademarks, logos, or branding except as necessary to use the
      Service as intended.
    </p>

    <h2>9. Subscription Plans and Billing</h2>
    <p>
      FIDMAP offers Startup and Business subscription plans, billed
      monthly or yearly, and a one-time Lifetime plan. Current pricing and
      plan limits are shown on our{" "}
      <a href="/#pricing">pricing page</a>. We may change our pricing or
      plan limits going forward; changes will not retroactively apply to a
      billing period you have already paid for.
    </p>

    <h2>10. Free Trial</h2>
    <p>
      New workspaces may start on a free trial of the Startup plan. No
      payment method is required to start a trial. At the end of the trial
      period, continued use of paid features requires selecting and paying
      for a subscription plan.
    </p>

    <h2>11. Lifetime Plan</h2>
    <p>
      The Lifetime plan is a one-time purchase that grants ongoing access
      to the plan's features for as long as FIDMAP operates the Service,
      subject to these Terms. It is not a guarantee of perpetual service
      availability irrespective of business circumstances, and it does not
      include future plan tiers or features released outside what is
      described for that plan at the time of purchase.
    </p>

    <h2>12. Payment Processing</h2>
    <p>
      Payments are processed by Paddle, our third-party payment provider
      and merchant of record for subscription and Lifetime purchases. We
      do not directly collect or store your full payment card details.
      Your purchase is also subject to Paddle's own terms and privacy
      policy.
    </p>

    <h2>13. Cancellation</h2>
    <p>
      You may cancel a recurring subscription at any time from your
      workspace's billing settings. Cancellation takes effect at the end
      of your current billing period; you will retain access to your paid
      plan's features until then, and you will not be charged again
      afterward. The Lifetime plan is a one-time purchase and has no
      recurring subscription to cancel.
    </p>

    <h2>14. Refunds</h2>
    <p>
      Refunds are handled according to our{" "}
      <a href="/refund-policy">Refund Policy</a>.
    </p>

    <h2>15. Service Availability</h2>
    <p>
      We aim to keep FIDMAP available and reliable, but the Service is
      provided on an "as available" basis. We do not guarantee
      uninterrupted or error-free operation, and the Service may be
      unavailable from time to time for maintenance, updates, or reasons
      outside our control.
    </p>

    <h2>16. Third-Party Services</h2>
    <p>
      FIDMAP relies on third-party infrastructure and services, including
      Paddle for payment processing, to operate. We are not responsible
      for the acts or omissions of third-party services, though we choose
      providers we believe are reputable.
    </p>

    <h2>17. Account Suspension/Termination</h2>
    <p>
      We may suspend or terminate your access to the Service if you
      materially violate these Terms, including through prohibited use
      described in Section 5, or if required to do so by law. You may stop
      using the Service and close your workspace at any time; outstanding
      obligations, such as unpaid fees for a period already used, survive
      termination.
    </p>

    <h2>18. Disclaimers</h2>
    <p>
      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT
      WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
      WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
      NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.
    </p>

    <h2>19. Limitation of Liability</h2>
    <p>
      TO THE MAXIMUM EXTENT PERMITTED BY LAW, FIDMAP WILL NOT BE LIABLE
      FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
      DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING
      FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM
      RELATING TO THE SERVICE WILL NOT EXCEED THE AMOUNT YOU PAID US IN
      THE TWELVE MONTHS BEFORE THE CLAIM AROSE.
    </p>

    <h2>20. Indemnification</h2>
    <p>
      You agree to indemnify and hold us harmless from any claims,
      damages, or expenses (including reasonable legal fees) arising from
      your Customer Content, your use of the Service in violation of these
      Terms, or your violation of any applicable law.
    </p>

    <h2>21. Changes to the Service</h2>
    <p>
      We may add, change, or remove features of FIDMAP over time,
      including as part of ongoing development. We will try to avoid
      removing functionality you materially rely on without reasonable
      notice, but we cannot guarantee that every feature will remain
      available indefinitely.
    </p>

    <h2>22. Changes to These Terms</h2>
    <p>
      We may update these Terms from time to time. If we make material
      changes, we will update the "Last updated" date above. Continued use
      of FIDMAP after changes take effect constitutes acceptance of the
      revised Terms.
    </p>

    <h2>23. Governing Law</h2>
    <p>
      These Terms are governed by the laws of [governing jurisdiction to
      be inserted], without regard to conflict-of-law principles, and any
      dispute arising from these Terms or your use of the Service will be
      resolved in the courts of that jurisdiction.
    </p>

    <h2>24. Contact Information</h2>
    <p>
      Questions about these Terms can be sent to{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
    </p>
  </LegalPage>
);

export default TermsOfService;
