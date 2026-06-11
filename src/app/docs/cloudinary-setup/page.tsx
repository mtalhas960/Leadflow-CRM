import type { Metadata } from "next";
import { Cloud, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Cloudinary Setup · File & Document Storage",
  description:
    "Step-by-step guide to create a Cloudinary account, get API keys, and configure upload presets for LeadFlow CRM document and file storage.",
  openGraph: {
    title: "Cloudinary Setup · File & Document Storage",
    description:
      "Configure Cloudinary for document and file storage in LeadFlow CRM.",
    url: "https://crm.tabishbinishfaq.dev/docs/cloudinary-setup",
    type: "article",
  },
};

function ScreenshotPlaceholder({ label, description }: { label: string; description: string }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
      <Cloud className="mx-auto mb-2 h-8 w-8 text-neutral-600" />
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

export default function CloudinarySetupPage() {
  return (
    <div>
      <h1>Cloudinary Setup</h1>
      <p className="lead">
        Cloudinary powers document uploads in LeadFlow · invoices, contracts, project files,
        and client documents. The free tier includes 25 GB of storage and 25 GB of bandwidth.
      </p>

      <hr />

      <h2>Step 1: Create a Cloudinary Account</h2>

      <ol>
        <li>
          Go to{" "}
          <a href="https://cloudinary.com/register" target="_blank" rel="noopener noreferrer">
            cloudinary.com/register
          </a>
          .
        </li>
        <li>Sign up with your email, Google account, or GitHub account.</li>
        <li>
          After verification, Cloudinary will create your account with a default
          <strong>Cloud Name</strong>, <strong>API Key</strong>, and{" "}
          <strong>API Secret</strong>.
        </li>
        <li>
          You&apos;ll be redirected to the Cloudinary Console dashboard.
        </li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Cloudinary Registration"
        description="Show the Cloudinary sign-up page with email input, then the dashboard after account creation showing Cloud Name, API Key, and API Secret."
      />

      <Callout type="tip">
        <strong>Free tier:</strong> Cloudinary&apos;s Free plan includes 25 GB of secure storage,
        25 GB of monthly bandwidth, and up to 100 MB per file. No credit card required.
      </Callout>

      <hr />

      <h2>Step 2: Get Your API Credentials</h2>

      <ol>
        <li>From the Cloudinary Console dashboard, locate the <strong>Account Details</strong> section.</li>
        <li>You&apos;ll see these three values:
          <ul>
            <li><strong>Cloud Name</strong> · your unique Cloudinary subdomain</li>
            <li><strong>API Key</strong> · a public key for API authentication</li>
            <li><strong>API Secret</strong> · a private key for API authentication</li>
          </ul>
        </li>
        <li>Copy these values · you&apos;ll need them for environment variables.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Cloudinary Dashboard · Account Details"
        description="Show the Cloudinary Console dashboard with Cloud Name, API Key, and API Secret highlighted. Call out each field."
      />

      <Callout type="warning">
        <strong>Keep your API Secret secure.</strong> It grants write access to your Cloudinary
        account. Never commit it to version control. Use environment variables in Vercel.
      </Callout>

      <hr />

      <h2>Step 3: Configure Upload Settings (Optional)</h2>

      <p>
        By default, LeadFlow uploads files with auto-tagging, moderation, and responsive
        image breakpoints disabled. If you want to customize upload behavior:
      </p>

      <ol>
        <li>
          In the Cloudinary Console, go to <strong>Settings</strong> &gt; <strong>Upload</strong>.
        </li>
        <li>
          Under <strong>Upload presets</strong>, click <strong>Add upload preset</strong>.
        </li>
        <li>
          Configure the preset:
          <ul>
            <li><strong>Preset name:</strong> <code>leadflow_uploads</code></li>
            <li><strong>Signing mode:</strong> Unsigned (for client-side uploads)</li>
            <li><strong>Folder:</strong> <code>leadflow</code> (optional, for organization)</li>
          </ul>
        </li>
        <li>Click <strong>Save</strong>.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Cloudinary Upload Preset"
        description="Show the Upload Settings page with the Add Upload Preset form filled out: preset name 'leadflow_uploads', signing mode 'Unsigned', folder 'leadflow'."
      />

      <Callout type="info">
        <strong>Upload preset:</strong> If you don&apos;t configure a custom upload preset,
        LeadFlow uses unsigned uploads directly with your cloud name and API key. The preset
        is only needed if you want to enforce specific folder structures or transformations.
      </Callout>

      <hr />

      <h2>Step 4: Environment Variables</h2>

      <p>
        Add the following variables to your <code>.env.local</code> file:
      </p>

      <pre>
        <code>{`# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=leadflow_uploads  # optional, if you created a preset
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
`}</code>
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
            <td><code>CLOUDINARY_CLOUD_NAME</code></td>
            <td>Yes</td>
            <td>Cloudinary Console → Account Details</td>
          </tr>
          <tr>
            <td><code>CLOUDINARY_API_KEY</code></td>
            <td>Yes</td>
            <td>Cloudinary Console → Account Details</td>
          </tr>
          <tr>
            <td><code>CLOUDINARY_API_SECRET</code></td>
            <td>Yes</td>
            <td>Cloudinary Console → Account Details</td>
          </tr>
          <tr>
            <td><code>CLOUDINARY_UPLOAD_PRESET</code></td>
            <td>No</td>
            <td>Settings → Upload → Upload presets</td>
          </tr>
          <tr>
            <td><code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code></td>
            <td>Yes</td>
            <td>Same as CLOUDINARY_CLOUD_NAME</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Summary</h2>

      <p>
        Cloudinary is now configured for file uploads. You should have:
      </p>

      <ul>
        <li>✅ Cloudinary account created</li>
        <li>✅ Cloud Name, API Key, and API Secret saved</li>
        <li>✅ (Optional) Upload preset configured</li>
        <li>✅ Environment variables recorded</li>
      </ul>

      <p>
        Next, configure{" "}
        <a href="/docs/resend-setup">Resend for transactional email</a>.
      </p>
    </div>
  );
}
