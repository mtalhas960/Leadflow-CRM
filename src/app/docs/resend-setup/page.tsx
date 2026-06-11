import type { Metadata } from "next";
import { Mail, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Resend Setup · Transactional Email",
  description:
    "Step-by-step guide to create a Resend account, verify your sending domain, and create an API key for LeadFlow CRM transactional email · with Brevo as a free fallback option.",
  openGraph: {
    title: "Resend Setup · Transactional Email",
    description:
      "Configure Resend for transactional email in LeadFlow CRM: account creation, domain verification, and API key setup.",
    url: "https://crm.tabishbinishfaq.dev/docs/resend-setup",
    type: "article",
  },
};

function ScreenshotPlaceholder({ label, description }: { label: string; description: string }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
      <Mail className="mx-auto mb-2 h-8 w-8 text-neutral-600" />
      <p className="font-medium text-neutral-300">{label}</p>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </div>
  );
}

function Callout({ type, children }: { type: "tip" | "warning" | "info"; children: React.ReactNode }) {
  const colors = {
    tip: "border-primary/20 bg-white/[3%]",
    warning: "border-amber-500/20 bg-white/[3%]",
    info: "border-blue-500/20 bg-white/[3%]",
  };
  return (
    <div className={`not-prose my-6 flex items-start gap-3 rounded-lg border p-4 ${colors[type]}`}>
      <span className="mt-0.5 shrink-0 text-base">{type === "tip" ? "💡" : type === "warning" ? "⚠️" : "ℹ️"}</span>
      <div className="text-sm text-neutral-300 [&_strong]:text-white [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">{children}</div>
    </div>
  );
}

export default function ResendSetupPage() {
  return (
    <div>
      <h1>Resend Setup</h1>
      <p className="lead">
        Resend powers transactional emails in LeadFlow · workspace invitations, password resets,
        invoice notifications, contract signing links, and email tracking (open/click).
        Resend offers 3,000 free emails/month.
      </p>

      <Callout type="info">
        <strong>Brevo fallback:</strong> LeadFlow also supports Brevo (formerly Sendinblue) as an
        alternative email provider. Brevo offers 300 emails/day on its free tier. If you prefer Brevo,
        set <code>BREVO_API_KEY</code> instead of <code>RESEND_API_KEY</code>.
      </Callout>

      <hr />

      <h2>Step 1: Create a Resend Account</h2>

      <ol>
        <li>
          Go to{" "}
          <a href="https://resend.com/signup" target="_blank" rel="noopener noreferrer">
            resend.com/signup
          </a>
          .
        </li>
        <li>Sign up with your email or Google account.</li>
        <li>Verify your email address via the confirmation link sent to your inbox.</li>
        <li>Complete the onboarding · you&apos;ll land on the Resend dashboard.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Resend Registration"
        description="Show the Resend sign-up page with email input and the dashboard after account creation."
      />

      <Callout type="tip">
        <strong>Free tier:</strong> Resend&apos;s Free plan includes 3,000 emails/month,
        100 emails/day, and 1 domain. No credit card required.
      </Callout>

      <hr />

      <h2>Step 2: Add and Verify Your Domain</h2>

      <p>
        Resend requires domain verification to send emails from your own domain name.
        This ensures email deliverability and prevents spoofing.
      </p>

      <ol>
        <li>In the Resend dashboard, click <strong>Add Domain</strong>.</li>
        <li>Enter your domain name (e.g., <code>yourdomain.com</code>).</li>
        <li>
          Resend will provide three DNS records to add to your domain:
          <ul>
            <li><strong>MX record</strong> · for email routing</li>
            <li><strong>TXT record</strong> · SPF verification</li>
            <li><strong>CNAME record</strong> · DKIM signing</li>
          </ul>
        </li>
        <li>
          Add these records to your domain&apos;s DNS configuration (usually in your domain
          registrar or Cloudflare dashboard).
        </li>
        <li>Click <strong>Verify</strong> in Resend to confirm DNS propagation.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Resend Domain Setup"
        description="Show the Add Domain form in Resend with the three DNS records (MX, TXT, CNAME) displayed. Highlight the copy buttons for each record."
      />

      <blockquote>
        <strong>DNS propagation</strong> can take a few minutes to a few hours. Resend will
        automatically verify once the records propagate. You can check verification status
        in the Domains dashboard.
      </blockquote>

      <ScreenshotPlaceholder
        label="Screenshot: DNS Records in Cloudflare"
        description="Show the Cloudflare (or registrar) DNS dashboard with the MX, TXT, and CNAME records added. Highlight the newly created records."
      />

      <ScreenshotPlaceholder
        label="Screenshot: Resend Domain Verified"
        description="Show the Domains page in Resend with a green 'Verified' badge next to the domain."
      />

      <hr />

      <h2>Step 3: Create an API Key</h2>

      <ol>
        <li>In the Resend dashboard left sidebar, click <strong>API Keys</strong>.</li>
        <li>Click <strong>Create API Key</strong>.</li>
        <li>
          Configure the key:
          <ul>
            <li><strong>Name:</strong> <code>LeadFlow CRM</code></li>
            <li><strong>Permission:</strong> <code>Sending access</code> (recommended)</li>
            <li><strong>Domain:</strong> Select the domain you verified in Step 2</li>
          </ul>
        </li>
        <li>Click <strong>Create</strong>.</li>
        <li>
          <strong>Copy the API key immediately</strong> · Resend shows it only once.
          Store it securely.
        </li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Resend API Key Creation"
        description="Show the Create API Key form with name, permission dropdown (Sending access), and domain selector. Then show the confirmation screen with the API key value (partially masked)."
      />

      <Callout type="warning">
        <strong>Lost your key?</strong> Resend does not display API key values after creation.
        If you lose it, delete the key and create a new one.
      </Callout>

      <hr />

      <h2>Step 4: Environment Variable</h2>

      <p>Add the following to your <code>.env.local</code>:</p>

      <pre>
        <code>{`# Resend (primary email provider)
RESEND_API_KEY=re_xxxxxxxxxxxx

# OR Brevo (fallback · use instead of Resend)
# BREVO_API_KEY=your_brevo_api_key`}</code>
      </pre>

      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Required</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>RESEND_API_KEY</code></td>
            <td>Yes (or BREVO_API_KEY)</td>
            <td>Resend Dashboard → API Keys → Create API Key</td>
          </tr>
          <tr>
            <td><code>BREVO_API_KEY</code></td>
            <td>Yes (or RESEND_API_KEY)</td>
            <td>Brevo Dashboard → API Keys</td>
          </tr>
        </tbody>
      </table>

      <p>
        LeadFlow uses <strong>Resend as the primary provider</strong>. If you set both,
        Resend takes priority. Set only one to avoid conflicts.
      </p>

      <hr />

      <h2>Summary</h2>

      <p>
        Email is now configured. You should have:
      </p>

      <ul>
        <li>✅ Resend account created</li>
        <li>✅ Domain verified with DNS records</li>
        <li>✅ API key created and saved</li>
        <li>✅ (Optional) Brevo API key as fallback</li>
        <li>✅ Environment variable set</li>
      </ul>

      <p>
        Next, set up{" "}
        <a href="/docs/google-calendar-setup">Google Calendar integration</a>.
      </p>
    </div>
  );
}
