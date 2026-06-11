import type { Metadata } from "next";
import { Database, ShieldCheck, Terminal, AlertTriangle, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Firebase Setup · Auth, Firestore & Storage",
  description:
    "Step-by-step guide to create a Firebase project, enable Authentication providers, create a Firestore database, deploy security rules and indexes, enable Storage, and retrieve configuration values for LeadFlow CRM.",
  openGraph: {
    title: "Firebase Setup · Auth, Firestore & Storage",
    description:
      "Complete Firebase configuration guide for LeadFlow CRM: project creation, authentication, database, and storage.",
    url: "https://crm.tabishbinishfaq.dev/docs/firebase-setup",
    type: "article",
  },
};

function ScreenshotPlaceholder({ label, description }: { label: string; description: string }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
      <Database className="mx-auto mb-2 h-8 w-8 text-neutral-600" />
      <p className="font-medium text-neutral-300">{label}</p>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>
    </div>
  );
}

function Callout({
  type,
  children,
}: {
  type: "tip" | "warning" | "info";
  children: React.ReactNode;
}) {
  const icons = { tip: "💡", warning: "⚠️", info: "ℹ️" };
  const colors = {
    tip: "border-primary/20 bg-white/[3%]",
    warning: "border-amber-500/20 bg-white/[3%]",
    info: "border-blue-500/20 bg-white/[3%]",
  };
  return (
    <div className={`not-prose my-6 flex items-start gap-3 rounded-lg border p-4 ${colors[type]}`}>
      <span className="mt-0.5 shrink-0 text-base">{icons[type]}</span>
      <div className="text-sm text-neutral-300 [&_strong]:text-white [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </div>
  );
}

export default function FirebaseSetupPage() {
  return (
    <div>
      <h1>Firebase Setup</h1>
      <p className="lead">
        Create a Firebase project, enable authentication providers, set up Firestore,
        deploy security rules, and configure Firebase Storage.
      </p>

      <Callout type="tip">
        <strong>Free tier:</strong> Firebase Spark plan includes 50,000 reads/day, 20,000 writes/day,
        and 1 GB of storage · enough for solo freelancers and small teams. No credit card required
        to start.
      </Callout>

      <hr />

      <h2>Step 1: Create a Firebase Project</h2>

      <ol>
        <li>
          Go to the{" "}
          <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
            Firebase Console
          </a>{" "}
          and sign in with your Google account.
        </li>
        <li>Click <strong>Create a project</strong> (or <strong>Add project</strong> if you already have projects).</li>
        <li>
          Enter a project name, e.g. <code>LeadFlow-CRM</code>.
          <ul>
            <li>Firebase will generate a unique project ID based on the name. You can edit it if needed.</li>
          </ul>
        </li>
        <li>
          <strong>Disable Google Analytics</strong> for this project (it&apos;s not required and avoids additional consent screens).
        </li>
        <li>Click <strong>Create project</strong> and wait for provisioning (usually 10–20 seconds).</li>
        <li>Click <strong>Continue</strong> when the setup completes.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Console · Create Project"
        description="Show the Create Project flow: project name input, Analytics toggle (off), and Create button."
      />

      <hr />

      <h2>Step 2: Register a Web App</h2>

      <p>
        Firebase needs a web app registration to generate the configuration values
        that LeadFlow uses to connect to your project.
      </p>

      <ol>
        <li>In the Firebase Console, click the <strong>&lt;/&gt;</strong> (Web) icon to register a web app.</li>
        <li>
          Enter a nickname for the app, e.g. <code>LeadFlow CRM</code>.
        </li>
        <li>
          <strong>Do not</strong> check &ldquo;Also set up Firebase Hosting&rdquo; · LeadFlow uses Vercel for hosting.
        </li>
        <li>
          Click <strong>Register app</strong>.
        </li>
        <li>
          You&apos;ll see the Firebase SDK snippet with your configuration object.{" "}
          <strong>Copy the entire config object</strong> · you&apos;ll need it later for
          environment variables. It looks like this:
        </li>
      </ol>

      <pre>
        <code>{`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};`}</code>
      </pre>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Web App Configuration"
        description="Show the SDK setup screen with the config object highlighted. Call out each field: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId."
      />

      <Callout type="info">
        <strong>Keep these values secure.</strong> The <code>apiKey</code> is technically
        public (it identifies your project to Firebase), but the other values should not
        be exposed unnecessarily. The <code>.env.example</code> file shows which variables
        map to which config fields.
      </Callout>

      <hr />

      <h2>Step 3: Enable Authentication</h2>

      <p>
        LeadFlow supports Email/Password, Google, and GitHub sign-in. You need to enable
        at least Email/Password for the app to function.
      </p>

      <h3>3.1 Enable Email/Password</h3>

      <ol>
        <li>In the Firebase Console left sidebar, click <strong>Authentication</strong>.</li>
        <li>Click the <strong>Get started</strong> button.</li>
        <li>Under <strong>Sign-in providers</strong>, click <strong>Email/Password</strong>.</li>
        <li>Enable the <strong>Email/Password</strong> toggle.</li>
        <li>Click <strong>Save</strong>.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Auth · Email/Password Provider"
        description="Show the Authentication page with Email/Password toggle enabled. Highlight the Enable switch and Save button."
      />

      <h3>3.2 Enable Google (Optional)</h3>

      <ol>
        <li>Click <strong>Add new provider</strong> &gt; <strong>Google</strong>.</li>
        <li>Enable the toggle.</li>
        <li>Select a support email from the dropdown.</li>
        <li>Click <strong>Save</strong>.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Auth · Google Provider"
        description="Show the Google sign-in provider configuration with the toggle enabled and support email selected."
      />

      <h3>3.3 Enable GitHub (Optional)</h3>

      <ol>
        <li>Click <strong>Add new provider</strong> &gt; <strong>GitHub</strong>.</li>
        <li>Enable the toggle.</li>
        <li>
          You&apos;ll need a <strong>Client ID</strong> and <strong>Client Secret</strong> from{" "}
          <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">
            GitHub OAuth Apps
          </a>
          .
        </li>
        <li>In GitHub, create a new OAuth App with the callback URL: <code>https://your-project.firebaseapp.com/__/auth/handler</code></li>
        <li>Copy the Client ID and Client Secret into Firebase.</li>
        <li>Click <strong>Save</strong>.</li>
      </ol>

      <Callout type="tip">
        <strong>Authorization domain:</strong> If you&apos;re using a custom domain with Vercel,
        add it to the <strong>Authorized domains</strong> list in the Authentication &gt; Settings tab.
        Firebase needs this to allow sign-in redirects from your domain.
      </Callout>

      <hr />

      <h2>Step 4: Create a Firestore Database</h2>

      <p>
        Firestore stores all your workspace data: leads, projects, invoices, contracts,
        messages, time entries, and more.
      </p>

      <ol>
        <li>In the Firebase Console left sidebar, click <strong>Firestore Database</strong>.</li>
        <li>Click <strong>Create database</strong>.</li>
        <li>Choose <strong>Start in production mode</strong> (you&apos;ll deploy custom rules later).</li>
        <li>Select a <strong>Cloud Firestore location</strong> closest to your users:
          <ul>
            <li><code>us-central</code> (Iowa) · good default for US audiences</li>
            <li><code>europe-west</code> (Belgium) · for EU audiences</li>
            <li><code>asia-southeast1</code> (Singapore) · for Asia audiences</li>
          </ul>
        </li>
        <li>Click <strong>Enable</strong>. Database provisioning takes a few seconds.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firestore · Create Database"
        description="Show the database creation screen: select production mode, choose region. Highlight the region selector and Enable button."
      />

      <hr />

      <h2>Step 5: Deploy Firestore Security Rules</h2>

      <p>
        LeadFlow includes pre-configured security rules that enforce role-based access
        control. These rules ensure users can only access data in workspaces they belong to.
      </p>

      <h3>Option A: Deploy via Firebase CLI (Recommended)</h3>

      <ol>
        <li>Install the Firebase CLI:</li>
      </ol>

      <pre>
        <code>{`npm install -g firebase-tools`}</code>
      </pre>

      <ol start={2}>
        <li>Log in to Firebase:</li>
      </ol>

      <pre>
        <code>{`firebase login`}</code>
      </pre>

      <ol start={3}>
        <li>Initialize Firebase in the project directory:</li>
      </ol>

      <pre>
        <code>{`firebase init firestore`}</code>
      </pre>

      <ol start={4}>
        <li>Select your Firebase project from the list.</li>
        <li>When prompted for rules and indexes files, accept the defaults: <code>firestore.rules</code> and <code>firestore.indexes.json</code>.</li>
        <li>Deploy the rules:</li>
      </ol>

      <pre>
        <code>{`firebase deploy --only firestore:rules,firestore:indexes`}</code>
      </pre>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase CLI · Deploy Rules"
        description="Show terminal output of `firebase deploy --only firestore:rules,firestore:indexes` with a successful deploy message."
      />

      <Callout type="warning">
        <strong>Important:</strong> The <code>firestore.rules</code> file in the LeadFlow
        repository uses <code>getUser()</code> and <code>getWorkspace()</code> helper functions
        that require the rules to be deployed together with the indexes. If you skip this step,
        database operations will fail with permission-denied errors.
      </Callout>

      <h3>Option B: Copy Rules via Console</h3>

      <ol>
        <li>Open <strong>Firestore Database</strong> &gt; <strong>Rules</strong> tab.</li>
        <li>Open <code>firestore.rules</code> in the LeadFlow project root.</li>
        <li>Copy the entire content and paste it into the Firebase Console editor.</li>
        <li>Click <strong>Publish</strong>.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firestore Console · Rules Editor"
        description="Show the Firestore Rules tab in Firebase Console with the pasted rules and Publish button highlighted."
      />

      <hr />

      <h2>Step 6: Deploy Firestore Indexes</h2>

      <p>
        Composite indexes are required for queries that sort or filter across multiple fields.
        The repository includes a pre-configured <code>firestore.indexes.json</code>.
      </p>

      <p>
        If you used Firebase CLI in Step 5 above, indexes are already deployed. Otherwise:
      </p>

      <ol>
        <li>Open <strong>Firestore Database</strong> &gt; <strong>Indexes</strong> tab.</li>
        <li>Click <strong>Add index</strong> and manually create each index defined in <code>firestore.indexes.json</code>.</li>
      </ol>

      <Callout type="tip">
        <strong>Automated deployment:</strong> The repository includes a GitHub Actions workflow
        (<code>.github/workflows/firebase-deploy.yml</code>) that automatically deploys rules
        and indexes on push to the main branch. You just need to add your Firebase token as a
        repository secret (<code>FIREBASE_TOKEN</code>).
      </Callout>

      <hr />

      <h2>Step 7: Enable Firebase Storage</h2>

      <p>
        Firebase Storage is used as a fallback for file uploads and for certain assets.
      </p>

      <ol>
        <li>In the Firebase Console left sidebar, click <strong>Storage</strong>.</li>
        <li>Click <strong>Get started</strong>.</li>
        <li>Select the default security rules (LeadFlow uses Cloudinary as the primary file storage).</li>
        <li>Choose a location (same as your Firestore region).</li>
        <li>Click <strong>Done</strong>.</li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Storage · Get Started"
        description="Show the Firebase Storage setup screen with the region selector and default security rules."
      />

      <hr />

      <h2>Step 8: Collect Configuration Values</h2>

      <p>
        You&apos;ll need these values when configuring environment variables. Navigate to
        <strong>Project Settings</strong> &gt; <strong>General</strong> &gt; <strong>Your apps</strong>
        &gt; <strong>Web app</strong>.
      </p>

      <table>
        <thead>
          <tr>
            <th>Config Value</th>
            <th>Source Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>apiKey</code></td>
            <td>Project Settings → General → Web API Key</td>
          </tr>
          <tr>
            <td><code>authDomain</code></td>
            <td>Project Settings → General → Firebase Auth domain</td>
          </tr>
          <tr>
            <td><code>projectId</code></td>
            <td>Project Settings → General → Project ID</td>
          </tr>
          <tr>
            <td><code>storageBucket</code></td>
            <td>Project Settings → General → Storage bucket</td>
          </tr>
          <tr>
            <td><code>messagingSenderId</code></td>
            <td>Project Settings → General → Cloud Messaging Sender ID</td>
          </tr>
          <tr>
            <td><code>appId</code></td>
            <td>Project Settings → General → Firebase App ID</td>
          </tr>
          <tr>
            <td><code>FIREBASE_ADMIN_CLIENT_EMAIL</code></td>
            <td>Project Settings → Service Accounts → Generate new private key → client_email</td>
          </tr>
          <tr>
            <td><code>FIREBASE_ADMIN_PRIVATE_KEY</code></td>
            <td>Project Settings → Service Accounts → Generate new private key → private_key</td>
          </tr>
        </tbody>
      </table>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Console · Project Settings"
        description="Show the Project Settings → General page with the Web App config object visible. Highlight the six config values."
      />

      <h3>Get Admin SDK Credentials</h3>

      <p>
        The Admin SDK is used for server-side operations (API routes, sending emails, etc.).
      </p>

      <ol>
        <li>Go to <strong>Project Settings</strong> &gt; <strong>Service accounts</strong>.</li>
        <li>Click <strong>Generate new private key</strong>.</li>
        <li>A JSON file will download. Extract the following values:
          <ul>
            <li><code>project_id</code> · same as your Project ID</li>
            <li><code>client_email</code> · used as <code>FIREBASE_ADMIN_CLIENT_EMAIL</code></li>
            <li><code>private_key</code> · used as <code>FIREBASE_ADMIN_PRIVATE_KEY</code></li>
          </ul>
        </li>
      </ol>

      <ScreenshotPlaceholder
        label="Screenshot: Firebase Service Account"
        description="Show the Service accounts tab with the 'Generate new private key' button highlighted and the downloaded JSON file contents."
      />

      <Callout type="warning">
        <strong>Secure the private key.</strong> The Admin SDK private key grants full access
        to your Firebase project. Never commit it to version control. Add it as a Vercel
        environment variable or a GitHub Actions secret.
      </Callout>

      <hr />

      <h2>Summary</h2>

      <p>
        After completing these steps, your Firebase project is ready. You should have:
      </p>

      <ul>
        <li>✅ Firebase project created</li>
        <li>✅ Web app registered with config values saved</li>
        <li>✅ Authentication providers enabled (Email/Password at minimum)</li>
        <li>✅ Firestore database created</li>
        <li>✅ Security rules deployed</li>
        <li>✅ Composite indexes deployed</li>
        <li>✅ Firebase Storage enabled</li>
        <li>✅ Admin SDK credentials downloaded</li>
      </ul>

      <p>
        Next, configure{" "}
        <a href="/docs/cloudinary-setup">Cloudinary for file storage</a>.
      </p>
    </div>
  );
}
