import LegalPage from "./LegalPage";
import { SUPPORT_EMAIL } from "../../constants/legal";

const PrivacyPolicy = () => (
  <LegalPage title="Privacy Policy" pageTitle="Privacy Policy | FIDMAP">
    <p>
      This Privacy Policy explains what information FIDMAP collects, how
      we use it, and the choices you have. It applies to staff users who
      register a workspace and to end users who interact with a
      workspace's public feedback board, roadmap, or changelog.
    </p>

    <h2>1. Information We Collect</h2>

    <h3>Account Information</h3>
    <p>
      When you register as a staff user or are added to a workspace, we
      collect your full name, email address, and a hashed version of your
      password (we do not store passwords in plain text).
    </p>

    <h3>Workspace Information</h3>
    <p>
      We collect the information a workspace provides when it is created,
      such as the workspace name, and the boards, roadmap items, and
      changelog entries that workspace's staff users create.
    </p>

    <h3>Feedback, Votes, and Comments</h3>
    <p>
      When an end user submits feedback, votes on a post, or leaves a
      comment on a workspace's public board, we collect the name and
      email address they provide along with the content of their
      submission. This information is used to identify that end user
      within the workspace (for example, so we know they have already
      voted on a post) and may be visible to the workspace's staff and,
      depending on the workspace's settings, to other visitors of its
      public portal.
    </p>

    <h3>Usage and Technical Information</h3>
    <p>
      Like most web services, our infrastructure and the services we rely
      on may automatically log technical information such as IP address,
      browser type, device information, and request timestamps, primarily
      for security, debugging, and abuse-prevention purposes.
    </p>

    <h3>Cookies / Similar Technologies</h3>
    <p>
      FIDMAP uses a minimal set of cookies or local storage strictly
      necessary to keep you signed in and to remember basic preferences.
      We do not currently use third-party advertising or tracking
      cookies.
    </p>

    <h2>2. How We Use Information</h2>
    <p>We use the information above to:</p>
    <ul>
      <li>Provide, operate, and maintain the Service;</li>
      <li>
        Authenticate staff users and keep workspaces separated from one
        another;
      </li>
      <li>
        Display feedback, votes, comments, roadmap, and changelog content
        as configured by each workspace;
      </li>
      <li>Process payments for subscriptions and the Lifetime plan;</li>
      <li>
        Communicate with you about your account, such as password resets
        or service notices; and
      </li>
      <li>Detect, investigate, and prevent abuse or security issues.</li>
    </ul>

    <h2>3. How We Share Information</h2>
    <p>
      We do not sell your personal information. We share information only
      in the following circumstances:
    </p>
    <ul>
      <li>
        With the workspace you interact with, since feedback, votes, and
        comments you submit are inherently shared with that workspace's
        staff;
      </li>
      <li>
        With service providers who help us operate FIDMAP (for example,
        hosting and payment processing), under obligations to protect
        your information;
      </li>
      <li>
        When required by law, legal process, or to protect the rights,
        property, or safety of FIDMAP, our users, or others; and
      </li>
      <li>
        In connection with a merger, acquisition, or sale of assets,
        subject to this Privacy Policy continuing to apply to your
        information.
      </li>
    </ul>

    <h2>4. Payment Processing</h2>
    <p>
      Subscription and Lifetime purchases are processed by Paddle, our
      payment provider and merchant of record. Paddle collects and
      processes your payment details directly; we receive limited billing
      information (such as subscription status) needed to manage your
      account, not your full card details. Paddle's own privacy policy
      governs its handling of your payment information.
    </p>

    <h2>5. Third-Party Services</h2>
    <p>
      We rely on third-party infrastructure providers to host and operate
      FIDMAP. These providers process data on our behalf and are not
      permitted to use it for their own independent purposes.
    </p>

    <h2>6. Data Retention</h2>
    <p>
      We retain account and workspace information for as long as your
      account or workspace remains active, and for a reasonable period
      afterward as needed for legal, accounting, or legitimate business
      purposes. You may request deletion of your account as described in
      "User Rights" below.
    </p>

    <h2>7. Data Security</h2>
    <p>
      We use reasonable technical and organizational measures, such as
      password hashing and access controls, to help protect your
      information. No method of transmission or storage is completely
      secure, and we cannot guarantee absolute security.
    </p>

    <h2>8. User Rights</h2>
    <p>
      Depending on your location, you may have rights to access, correct,
      or delete your personal information, or to object to or restrict
      certain processing. Staff users can update their account
      information from within the product where available, or by
      contacting us. End users may request that we remove information
      associated with their votes, comments, or feedback submissions by
      contacting us at{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
    </p>

    <h2>9. International Data Transfers</h2>
    <p>
      Depending on where you and our service providers are located, your
      information may be processed in a country other than your own.
      Where this occurs, we rely on our service providers' own safeguards
      for cross-border data handling.
    </p>

    <h2>10. Children's Privacy</h2>
    <p>
      FIDMAP is not directed to children, and we do not knowingly collect
      personal information from children under the age of 13 (or the
      relevant age of digital consent in your jurisdiction). If you
      believe a child has provided us with personal information, please
      contact us so we can remove it.
    </p>

    <h2>11. Changes to This Privacy Policy</h2>
    <p>
      We may update this Privacy Policy from time to time. If we make
      material changes, we will update the "Last updated" date above.
      Continued use of FIDMAP after changes take effect constitutes
      acceptance of the revised policy.
    </p>

    <h2>12. Contact Information</h2>
    <p>
      Questions about this Privacy Policy, or requests regarding your
      information, can be sent to{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
    </p>
  </LegalPage>
);

export default PrivacyPolicy;
