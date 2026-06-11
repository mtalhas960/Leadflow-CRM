import type { Metadata } from "next";
import { Globe, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Google Calendar Setup · Calendar Sync & Meet",
  description:
    "Step-by-step guide to enable the Google Calendar API, configure the OAuth consent screen, create OAuth 2.0 credentials, and connect Google Meet for LeadFlow CRM.",
  openGraph: {
    title: "Google Calendar Setup · Calendar Sync & Meet",
    description:
      "Configure Google Calendar and Meet integration for LeadFlow CRM: Google Cloud project, OAuth consent, and credentials.",
    url: "https://crm.tabishbinishfaq.dev/docs/google-calendar-setup",
    type: "article",
  },
};

function ScreenshotPlaceholder({ label, description }: { label: string; description: string }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
      <Globe className="mx-auto mb-2 h-8 w-8 text-neutral-600" />
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

export default function GoogleCalendarSetupPage() {
  return (
    <div>
      <h1>Google Calendar Setup</h1>
      <p className="lead">
        Google Calendar integration powers meeting scheduling, calendar sync, and Google Meet
        creation in LeadFlow. The Google Calendar API is free to use within standard quota limits.
      </p>

      <hr />

      <h2>Step 1: Create a Google Cloud Project</h2>

      <p>
        Calendar and Meet features require a Google Cloud project with the Calendar API enabled.
      </p>

      <ol>
        <li>
          Go to the{" "}
          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
            Google Cloud Console
          </a>
          .
        </li>
        <li>
          Click the project dropdown at the top of the page and select <strong>New Project</strong>.
        </li>
        <li>
          Enter a project name, e.g. <code>LeadFlow Calendar</code>.
        </li>
        <li>
          Leave <strong>Location</strong> as &ldquo;No organization&rdquo; (unless you have a
          Google Workspace organization).
        </li>
        <li>Click <strong>Create</strong>.</li>
        <li>
          Select the newly created project from the project dropdown.
        </li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Google Cloud · New Project"
        description="Show the Google Cloud Console with the New Project form: project name input, location dropdown, and Create button."
      />

      <Callout type="tip">
        <strong>No credit card needed.</strong> Google Cloud requires a billing account for
        some services, but the Calendar API is free within quota. You can enable billing
        or skip it · Calendar API calls are free.
      </Callout>

      <hr />

      <h2>Step 2: Enable the Google Calendar API</h2>

      <ol>
        <li>
          In the Google Cloud Console, navigate to{" "}
          <strong>APIs &amp; Services</strong> &gt; <strong>Library</strong>.
        </li>
        <li>
          Search for &ldquo;Google Calendar API&rdquo;.
        </li>
        <li>
          Click on the <strong>Google Calendar API</strong> result.
        </li>
        <li>
          Click <strong>Enable</strong>.
        </li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Google Cloud · Enable Calendar API"
        description="Show the API Library with 'Google Calendar API' selected and the Enable button highlighted."
      />

      <blockquote>
        After enabling, you&apos;ll see the API Overview page with usage metrics,
        credentials guidance, and quota information.
      </blockquote>

      <hr />

      <h2>Step 3: Configure the OAuth Consent Screen</h2>

      <p>
        Google requires an OAuth consent screen before users can authorize calendar access.
        This screen shows what permissions your app is requesting.
      </p>

      <ol>
        <li>
          Navigate to <strong>APIs &amp; Services</strong> &gt; <strong>OAuth consent screen</strong>.
        </li>
        <li>
          Select <strong>External</strong> user type (unless you&apos;re using Google Workspace).
        </li>
        <li>Click <strong>Create</strong>.</li>
        <li>
          Fill in the required fields:
          <ul>
            <li><strong>App name:</strong> <code>LeadFlow CRM</code></li>
            <li><strong>User support email:</strong> Your email address</li>
            <li><strong>Developer contact information:</strong> Your email address</li>
          </ul>
        </li>
        <li>Click <strong>Save and Continue</strong>.</li>
        <li>
          On the <strong>Scopes</strong> page, click <strong>Add or Remove Scopes</strong>.
        </li>
        <li>
          Add the Calendar API scope:
          <pre><code>https://www.googleapis.com/auth/calendar.events</code></pre>
          <ul>
            <li>This grants read/write access to calendar events (create meetings, view schedule).</li>
          </ul>
        </li>
        <li>Click <strong>Update</strong>, then <strong>Save and Continue</strong>.</li>
        <li>
          On the <strong>Test users</strong> page, click <strong>Add Users</strong> and add
          your email address (so you can test the integration).
        </li>
        <li>Click <strong>Save and Continue</strong>.</li>
        <li>Review your settings and click <strong>Back to Dashboard</strong>.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: OAuth Consent Screen · App Name"
        description="Show the OAuth consent screen editor with app name 'LeadFlow CRM', support email, and developer contact filled in."
      />

      <ScreenshotPlaceholder
        label="Screenshot: OAuth Consent Screen · Scopes"
        description="Show the Scopes page with 'https://www.googleapis.com/auth/calendar.events' added. Highlight the scope input and Add button."
      />

      <Callout type="info">
        <strong>Publishing status:</strong> Your app will be in &ldquo;Testing&rdquo; mode.
        This is fine for personal or team use. Only up to 100 test users can authorize.
        If you need more, submit for verification (requires a privacy policy URL).
      </Callout>

      <hr />

      <h2>Step 4: Create OAuth 2.0 Credentials</h2>

      <ol>
        <li>
          Navigate to <strong>APIs &amp; Services</strong> &gt; <strong>Credentials</strong>.
        </li>
        <li>
          Click <strong>+ Create Credentials</strong> &gt; <strong>OAuth client ID</strong>.
        </li>
        <li>
          Select <strong>Web application</strong> as the application type.
        </li>
        <li>
          Enter a name, e.g. <code>LeadFlow Web Client</code>.
        </li>
        <li>
          Under <strong>Authorized JavaScript origins</strong>, add:
          <pre><code>https://crm.yourdomain.com
http://localhost:3000</code></pre>
        </li>
        <li>
          Under <strong>Authorized redirect URIs</strong>, add:
          <pre><code>https://crm.yourdomain.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback</code></pre>
        </li>
        <li>Click <strong>Create</strong>.</li>
        <li>
          A dialog will show your <strong>Client ID</strong> and <strong>Client Secret</strong>.
          Copy both immediately.
        </li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Google Cloud · OAuth Credentials"
        description="Show the Create OAuth client ID form: Web application type, name 'LeadFlow Web Client', Authorized JavaScript origins with localhost and production URLs, Authorized redirect URIs with callback paths. Then show the confirmation dialog with Client ID and Client Secret."
      />

      <Callout type="warning">
        <strong>Authorized URIs must match exactly.</strong> The redirect URI must match
        the production URL of your deployed app. If you change your domain, update these URIs.
        Mismatched URIs are the #1 cause of OAuth failures.
      </Callout>

      <hr />

      <h2>Step 5: Environment Variables</h2>

      <p>Add the following to your <code>.env.local</code>:</p>

      <pre>
        <code>{`# Google Calendar
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_REDIRECT_URI=https://crm.yourdomain.com/api/auth/google/callback
# Same as NEXT_PUBLIC_APP_URL in most cases
NEXT_PUBLIC_APP_URL=https://crm.yourdomain.com`}</code>
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
            <td><code>GOOGLE_CLIENT_ID</code></td>
            <td>Yes</td>
            <td>Google Cloud → Credentials → OAuth 2.0 Client ID</td>
          </tr>
          <tr>
            <td><code>GOOGLE_CLIENT_SECRET</code></td>
            <td>Yes</td>
            <td>Google Cloud → Credentials → OAuth 2.0 Client Secret</td>
          </tr>
          <tr>
            <td><code>GOOGLE_REDIRECT_URI</code></td>
            <td>Yes</td>
            <td>Your app&apos;s callback URL (must match Credentials config)</td>
          </tr>
          <tr>
            <td><code>NEXT_PUBLIC_APP_URL</code></td>
            <td>Yes</td>
            <td>Your Vercel deployment URL or custom domain</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Summary</h2>

      <p>
        Google Calendar is now configured. You should have:
      </p>

      <ul>
        <li>✅ Google Cloud project created</li>
        <li>✅ Google Calendar API enabled</li>
        <li>✅ OAuth consent screen configured with test user added</li>
        <li>✅ OAuth 2.0 credentials created (Client ID + Client Secret)</li>
        <li>✅ Authorized URIs configured in credentials</li>
        <li>✅ Environment variables set</li>
      </ul>

      <p>
        Next, set up{" "}
        <a href="/docs/env-variables">all environment variables</a> and{" "}
        <a href="/docs/deploy">deploy to Vercel</a>.
      </p>
    </div>
  );
}
