import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deploy to Vercel · Self-Host LeadFlow CRM",
  description:
    "Step-by-step guide to deploy LeadFlow CRM on Vercel, configure environment variables, set up a custom domain, and verify your deployment. Self-hosting on any Node.js server alternative included.",
  openGraph: {
    title: "Deploy to Vercel · Self-Host LeadFlow CRM",
    description:
      "Deploy LeadFlow CRM on Vercel in 5 minutes: import from GitHub, configure environment variables, deploy, and verify.",
    url: "https://crm.tabishbinishfaq.dev/docs/deploy",
    type: "article",
  },
};

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

export default function DeployPage() {
  return (
    <div>
      <h1>Deploy to Vercel</h1>
      <p className="lead">
        Deploy your LeadFlow instance to Vercel in under 5 minutes. Vercel provides
        automatic HTTPS, a global CDN, continuous deployment from Git, and a generous
        free tier (100 GB bandwidth, 100k function invocations per month).
      </p>

      <Callout type="info">
        <strong>Prerequisites:</strong> Before deploying, complete the service setup guides:
        <a href="/docs/firebase-setup">Firebase</a>,{" "}
        <a href="/docs/cloudinary-setup">Cloudinary</a>,{" "}
        <a href="/docs/resend-setup">Resend</a>,{" "}
        <a href="/docs/google-calendar-setup">Google Calendar</a>, and{" "}
        <a href="/docs/env-variables">environment variables</a>.
      </Callout>

      <hr />

      <h2>Step 1: Push Your Fork to GitHub</h2>

      <p>
        If you haven&apos;t already, push your forked repository to GitHub:
      </p>

      <pre>
        <code>{`# If you cloned your fork locally and made changes
git push origin main`}</code>
      </pre>

      <p>
        Your repository should contain all the LeadFlow source code with your
        configuration changes committed.
      </p>

      <hr />

      <h2>Step 2: Import to Vercel</h2>

      <ol>
        <li>
          Go to{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>{" "}
          and sign in with your GitHub account.
        </li>
        <li>
          Click <strong>Add New</strong> → <strong>Project</strong>.
        </li>
        <li>
          Find your forked <code>Leadflow-CRM</code> repository and click <strong>Import</strong>.
        </li>
        <li>
          Vercel auto-detects Next.js · no build configuration is needed. The default settings work:
          <ul>
            <li><strong>Framework Preset:</strong> Next.js</li>
            <li><strong>Root Directory:</strong> <code>./</code></li>
            <li><strong>Build Command:</strong> <code>next build</code> (auto-detected)</li>
            <li><strong>Output Directory:</strong> <code>.next</code> (auto-detected)</li>
          </ul>
        </li>
      </ol>

      <div className="not-prose rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
        <p className="font-medium text-neutral-300">Screenshot: Vercel Import Project</p>
        <p className="mt-1 text-xs text-neutral-500">Show the Vercel dashboard with the Import Git Repository page. Highlight the Leadflow-CRM repository and Import button.</p>
      </div>

      <hr />

      <h2>Step 3: Configure Environment Variables</h2>

      <p>
        Before deploying, add all environment variables in Vercel&apos;s project settings.
        This step is critical · without these variables, the app won&apos;t connect to Firebase
        or other services.
      </p>

      <ol>
        <li>In the Vercel project configuration page, expand <strong>Environment Variables</strong>.</li>
        <li>Add each variable from your <code>.env.local</code> file.</li>
        <li>
          For <code>FIREBASE_ADMIN_PRIVATE_KEY</code>, paste the entire key value including
          <code>-----BEGIN PRIVATE KEY-----</code> and <code>-----END PRIVATE KEY-----</code>.
          Vercel handles newlines automatically.
        </li>
        <li>
          Make sure <code>NEXT_PUBLIC_APP_URL</code> is set to your production URL
          (e.g. <code>https://crm.yourdomain.com</code>).
        </li>
      </ol>

      <div className="not-prose rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
        <p className="font-medium text-neutral-300">Screenshot: Vercel Environment Variables</p>
        <p className="mt-1 text-xs text-neutral-500">Show the Vercel project settings with environment variables filled in: Firebase config, Admin SDK, Cloudinary, Resend, Google Calendar. Highlight the key-value pairs.</p>
      </div>

      <Callout type="tip">
        <strong>Bulk import:</strong> You can copy all variables from your <code>.env.local</code>
        file and paste them in bulk using the &ldquo;Import .env&rdquo; feature in the Vercel UI.
        Vercel will parse and add them automatically.
      </Callout>

      <hr />

      <h2>Step 4: Deploy</h2>

      <ol>
        <li>Click <strong>Deploy</strong>. Vercel will:
          <ul>
            <li>Clone your repository</li>
            <li>Install dependencies (<code>npm install</code>)</li>
            <li>Build the Next.js application (<code>next build</code>)</li>
            <li>Deploy to Vercel&apos;s global edge network</li>
          </ul>
        </li>
        <li>The first deployment takes 1–3 minutes.</li>
        <li>Once complete, Vercel shows a <strong>Congratulations</strong> page with your deployment URL.</li>
      </ol>

      <div className="not-prose rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
        <p className="font-medium text-neutral-300">Screenshot: Vercel Deployment Complete</p>
        <p className="mt-1 text-xs text-neutral-500">Show the Vercel Congratulations screen with the deployment URL (e.g. leadflow-crm.vercel.app) and the Visit button.</p>
      </div>

      <Callout type="warning">
        <strong>Build fails?</strong> The most common causes are missing environment variables,
        especially <code>NEXT_PUBLIC_FIREBASE_*</code> and <code>FIREBASE_ADMIN_PRIVATE_KEY</code>.
        Check the build logs in Vercel for the specific error.
      </Callout>

      <hr />

      <h2>Step 5: Set Up a Custom Domain (Optional)</h2>

      <p>
        Vercel assigns a <code>.vercel.app</code> domain by default. For production, use
        your own domain:
      </p>

      <ol>
        <li>
          In your Vercel project dashboard, go to <strong>Settings</strong> → <strong>Domains</strong>.
        </li>
        <li>
          Enter your domain (e.g. <code>crm.yourdomain.com</code>) and click <strong>Add</strong>.
        </li>
        <li>
          Vercel will show DNS configuration instructions:
          <ul>
            <li>Add a <strong>CNAME record</strong> pointing <code>crm</code> to <code>cname.vercel-dns.com</code></li>
            <li>Or point your nameservers to Vercel (for apex domain support)</li>
          </ul>
        </li>
        <li>
          Configure the DNS record in your domain registrar or Cloudflare dashboard.
        </li>
        <li>
          Vercel automatically provisions a TLS certificate (HTTPS) for your domain.
        </li>
      </ol>

      <div className="not-prose rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
        <p className="font-medium text-neutral-300">Screenshot: Vercel Custom Domain Configuration</p>
        <p className="mt-1 text-xs text-neutral-500">Show the Vercel Domains settings with a custom domain added, DNS instructions displayed, and TLS status as 'Auto Renew'.</p>
      </div>

      <Callout type="tip">
        After adding a custom domain, update <code>NEXT_PUBLIC_APP_URL</code> in your
        Vercel environment variables to match your new domain, then redeploy.
      </Callout>

      <hr />

      <h2>Step 6: Continuous Deployment</h2>

      <p>
        Vercel automatically deploys every time you push to your GitHub repository&apos;s
        default branch. The workflow is:
      </p>

      <ol>
        <li>Make changes locally</li>
        <li>Commit and push to GitHub: <code>git push origin main</code></li>
        <li>Vercel detects the push, builds, and deploys automatically</li>
        <li>Your site updates in under 2 minutes</li>
      </ol>

      <p>
        You can also create <strong>Preview Deployments</strong> for pull requests ·
        Vercel automatically deploys each PR to a unique preview URL for testing.
      </p>

      <hr />

      <h2>Alternative: Self-Host on Any Node.js Server</h2>

      <p>
        If you prefer to self-host rather than use Vercel, LeadFlow runs on any Node.js server:
      </p>

      <pre>
        <code>{`# Clone your fork on the server
git clone https://github.com/Tabish5858/Leadflow-CRM.git
cd Leadflow-CRM

# Install dependencies
npm install

# Create and configure .env file
cp .env.example .env
# Edit .env with your service credentials

# Build for production
npm run build

# Start the server
npm start`}</code>
      </pre>

      <p>
        The production server runs on <code>http://localhost:3000</code> by default.
        Use a reverse proxy (nginx, Caddy) with automatic HTTPS in front of it.
      </p>

      <Callout type="info">
        <strong>Requirements:</strong> Node.js 22+ and npm 10+. LeadFlow stores all data
        in Firebase, so no database setup is needed on the server.
      </Callout>

      <hr />

      <h2>Verify the Deployment</h2>

      <p>
        After deploying, verify everything works:
      </p>

      <ul>
        <li><strong>Landing page loads</strong> · Visit your deployment URL</li>
        <li><strong>Authentication works</strong> · Register a new account or sign in</li>
        <li><strong>Demo mode loads</strong> · Click &ldquo;Try Demo&rdquo; on the landing page</li>
        <li><strong>Firestore operations work</strong> · Create a test lead or project</li>
        <li><strong>Documents upload</strong> · Upload a file in the Documents section</li>
        <li><strong>Emails send</strong> · Check the Resend dashboard for sent emails</li>
      </ul>

      <p>
        If something isn&apos;t working, check the Vercel deployment logs or the
        browser console for error messages.
      </p>

      <hr />

      <h2>Next Steps</h2>

      <ul>
        <li>
          <a href="/docs/architecture">Explore the architecture</a> · understand how the
          modules, data layer, and services fit together.
        </li>
        <li>
          Review the <a href="https://github.com/Tabish5858/Leadflow-CRM/blob/main/CONTRIBUTING.md">contributing guide</a>{" "}
          if you want to customize or extend the platform.
        </li>
      </ul>
    </div>
  );
}
