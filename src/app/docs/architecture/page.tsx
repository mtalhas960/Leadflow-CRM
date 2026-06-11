import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture · Next.js 16, Firebase & Vercel",
  description:
    "Explore the LeadFlow CRM tech stack · Next.js 16, React 19, Firebase, Vercel, and UniverJS for spreadsheets. Modular design for self-hosting and customization.",
  openGraph: {
    title: "Architecture · Next.js 16, Firebase & Vercel",
    description:
      "Explore the LeadFlow CRM architecture: Next.js 16, React 19, Firebase, Vercel, and modular design.",
    url: "https://crm.tabishbinishfaq.dev/docs/architecture",
    type: "article",
  },
};

const sections = [
  {
    title: "Presentation Layer",
    subtitle: "Next.js 16 + React 19 + Tailwind CSS 4",
    items: [
      "Server-side rendering (SSR) and static generation (SSG) via Next.js App Router",
      "React 19 with Server Components for optimal performance",
      "Tailwind CSS 4 for utility-first responsive design",
      "shadcn/ui component library for a consistent design system",
      "Lucide icons for lightweight, tree-shakeable iconography",
    ],
  },
  {
    title: "Authentication & Security",
    subtitle: "Firebase Authentication + Admin SDK",
    items: [
      "Email/password authentication with Firebase Auth",
      "Google and GitHub OAuth sign-in options",
      "Role-based access control (Owner, Admin, Member, Viewer, Client)",
      "Module-level access controls per workspace role",
      "Firebase Admin SDK for server-side operations (API routes)",
      "Full audit trail logging for all workspace mutations",
    ],
  },
  {
    title: "Data Layer",
    subtitle: "Firebase Firestore + Real-time Subscriptions",
    items: [
      "Firestore for real-time data synchronization across clients",
      "Real-time listeners for instant UI updates on data changes",
      "Firebase Security Rules for row-level access control with workspace isolation",
      "Optimistic updates for responsive UI interactions",
      "Firebase Storage for document and file upload fallback",
      "Composite indexes for complex query patterns",
    ],
  },
  {
    title: "Spreadsheet & Analytics",
    subtitle: "UniverJS + Custom Analytics Engine",
    items: [
      "UniverJS powers the lead spreadsheet module with Excel-like functionality",
      "Custom analytics engine for project value, conversion rates, and cycle times",
      "Exportable reports for projects, invoices, and time tracking data",
      "KPI cards, time-series charts, pie/bar charts, and conversion funnels",
      "PDF export for reports and invoices",
    ],
  },
  {
    title: "File Storage",
    subtitle: "Cloudinary (Primary) + Firebase Storage (Fallback)",
    items: [
      "Cloudinary for document images, file uploads, and optimized delivery",
      "Automatic image optimization and responsive breakpoints",
      "Firebase Storage as a fallback storage provider",
      "10 MB file size limit with drag-and-drop upload UI",
    ],
  },
  {
    title: "Email & Notifications",
    subtitle: "Resend + Brevo Fallback",
    items: [
      "Resend for transactional email delivery (3,000 free emails/month)",
      "Brevo as an alternative fallback provider (300 emails/day free)",
      "Open/click tracking via tracking pixel and link rewriting",
      "HTML email templates for invites, invoices, and notifications",
      "In-app notification bell with real-time unread counts",
    ],
  },
  {
    title: "Calendar & Meetings",
    subtitle: "Google Calendar API + Google Meet",
    items: [
      "Google Calendar OAuth integration for calendar sync",
      "Google Meet creation for video conferencing",
      "Public booking pages with timezone-aware slot selection",
      "Configurable meeting types with duration, buffer, and questions",
      "Conflict detection for meeting scheduling",
    ],
  },
  {
    title: "Infrastructure & Deployment",
    subtitle: "Vercel + Node.js",
    items: [
      "Vercel for instant deployment with automatic HTTPS and global CDN",
      "Node.js self-hosting option · run on any server",
      "Environment-based configuration for dev, staging, and production",
      "Stateless architecture · scale horizontally by adding instances",
      "Continuous deployment from GitHub · push to deploy",
      "Preview deployments for pull request testing",
    ],
  },
];

export default function ArchitecturePage() {
  return (
    <div>
      <h1>Architecture</h1>
      <p className="lead">
        LeadFlow is built on a modern, modular stack. Each service has a clear responsibility
        and can be replaced or scaled independently. This section explains how the pieces
        fit together.
      </p>

      <hr />

      <h2>System Overview</h2>

      <p>
        LeadFlow follows a <strong>server-rendered frontend + backend-as-a-service</strong> pattern:
      </p>

      <ul>
        <li>
          <strong>Frontend:</strong> Next.js 16 with App Router, Server Components, and
          React 19. Deployed on Vercel or any Node.js server.
        </li>
        <li>
          <strong>Database:</strong> Firebase Firestore with real-time listeners.
          All data is stored in Firestore · no other database needed.
        </li>
        <li>
          <strong>Authentication:</strong> Firebase Auth handles sign-in, account management,
          and session tokens. The Admin SDK verifies tokens server-side.
        </li>
        <li>
          <strong>File Storage:</strong> Cloudinary for uploads and image optimization,
          with Firebase Storage as a fallback.
        </li>
        <li>
          <strong>Email:</strong> Resend (primary) or Brevo (fallback) for transactional emails.
        </li>
        <li>
          <strong>Calendar:</strong> Google Calendar API via OAuth 2.0 for calendar sync
          and Google Meet creation.
        </li>
      </ul>

      <div className="not-prose rounded-lg border border-dashed border-neutral-800 bg-white/[3%] p-8 text-center text-sm text-neutral-400">
        <p className="font-medium text-neutral-300">Diagram: System Architecture Overview</p>
        <p className="mt-1 text-xs text-neutral-500">Show a layered architecture diagram: Browser → Vercel (Next.js SSR) → Firebase (Auth, Firestore, Storage) → Cloudinary → Resend → Google Calendar. Arrows showing data flow between layers.</p>
      </div>

      <hr />

      <h2>Module Architecture</h2>

      <p>
        Each workspace module (Leads, Projects, Invoices, Contracts, etc.) follows the
        same pattern:
      </p>

      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
            <th>Responsibility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>UI Components</td>
            <td>React + shadcn/ui</td>
            <td>Page layout, forms, tables, modals, drag-and-drop</td>
          </tr>
          <tr>
            <td>Data Fetching</td>
            <td>React hooks + TanStack Query</td>
            <td>Firestore reads, caching, optimistic updates</td>
          </tr>
          <tr>
            <td>State</td>
            <td>Zustand</td>
            <td>Workspace context, accent color, header state</td>
          </tr>
          <tr>
            <td>Validation</td>
            <td>Zod</td>
            <td>Form validation, API input validation</td>
          </tr>
          <tr>
            <td>API Routes</td>
            <td>Next.js Route Handlers</td>
            <td>Server-side operations (email, uploads, OAuth, meetings)</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>Firestore</td>
            <td>Real-time documents and collections per module</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Module Overviews</h2>

      {sections.map((section) => (
        <div key={section.title}>
          <h3>{section.title}</h3>
          <p className="not-prose -mt-3 mb-4 text-sm text-neutral-400">{section.subtitle}</p>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <hr />

      <h2>Data Flow</h2>

      <p>A typical data flow in LeadFlow works like this:</p>

      <ol>
        <li>
          <strong>Browser request</strong> hits Vercel&apos;s edge network
        </li>
        <li>
          <strong>Next.js renders</strong> the page (SSR or SSG depending on the route)
        </li>
        <li>
          <strong>Client-side hydration</strong> activates React components
        </li>
        <li>
          <strong>Firestore listeners</strong> subscribe to real-time data for the active workspace
        </li>
        <li>
          <strong>User mutations</strong> (create, update, delete) go through:
          <ul>
            <li>Firestore SDK for direct database operations (client-side writes)</li>
            <li>Next.js API Route for server-side operations (email, file upload, OAuth)</li>
          </ul>
        </li>
        <li>
          <strong>Firestore security rules</strong> validate every read/write against
          workspace membership and role permissions
        </li>
        <li>
          <strong>Real-time updates</strong> propagate to all connected clients automatically
        </li>
      </ol>

      <hr />

      <h2>Security Architecture</h2>

      <p>LeadFlow uses defense-in-depth security across multiple layers:</p>

      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Protection</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Edge</td>
            <td>Cloudflare WAF (OWASP Core Ruleset, rate limiting, bot management, DDoS protection)</td>
          </tr>
          <tr>
            <td>Application</td>
            <td>Server Action re-authorization, Admin SDK confined to API routes, server-only guards, input validation with Zod</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>Firestore security rules with role-based access, workspace isolation, owner-only operations</td>
          </tr>
          <tr>
            <td>Authentication</td>
            <td>Firebase Auth with optional MFA, custom password reset tokens (1hr expiry), rate-limited invite acceptance</td>
          </tr>
          <tr>
            <td>Audit</td>
            <td>Full audit trail (who, what, when) on all mutations</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Technology Stack</h2>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Technology</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Framework</td><td>Next.js 16 (App Router)</td></tr>
          <tr><td>Language</td><td>TypeScript 5.8 (strict mode)</td></tr>
          <tr><td>UI</td><td>React 19, Tailwind CSS 4, shadcn/ui</td></tr>
          <tr><td>State Management</td><td>Zustand 5, TanStack Query 5</td></tr>
          <tr><td>Database</td><td>Firestore (Firebase) with real-time listeners</td></tr>
          <tr><td>Authentication</td><td>Firebase Auth + Firebase Admin SDK</td></tr>
          <tr><td>File Storage</td><td>Cloudinary (primary), Firebase Storage (fallback)</td></tr>
          <tr><td>Email</td><td>Resend (primary), Brevo (optional fallback)</td></tr>
          <tr><td>Calendar</td><td>Google Calendar API / Google Meet</td></tr>
          <tr><td>Spreadsheets</td><td>UniverJS</td></tr>
          <tr><td>Charts</td><td>Recharts 2</td></tr>
          <tr><td>Forms</td><td>React Hook Form 7 + Zod 3</td></tr>
          <tr><td>Tables</td><td>TanStack Table 8</td></tr>
          <tr><td>Drag &amp; Drop</td><td>@dnd-kit</td></tr>
          <tr><td>CI/CD</td><td>GitHub Actions (lint, typecheck, build, Firestore deploy)</td></tr>
          <tr><td>Hosting</td><td>Vercel (primary), any Node.js server (alternative)</td></tr>
        </tbody>
      </table>

      <hr />

      <h2>Free Tier Architecture</h2>

      <p>
        LeadFlow is designed to run entirely on free tiers. Here&apos;s how the services
        fit within their free limits:
      </p>

      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Free Limit</th>
            <th>Usage in LeadFlow</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Firebase Spark</td>
            <td>50k reads/day, 20k writes/day</td>
            <td>All database operations, authentication</td>
          </tr>
          <tr>
            <td>Vercel Hobby</td>
            <td>100 GB bandwidth, 100k functions/month</td>
            <td>Hosting, serverless functions, CDN</td>
          </tr>
          <tr>
            <td>Cloudinary Free</td>
            <td>25 GB storage, 25 GB bandwidth</td>
            <td>File and document uploads</td>
          </tr>
          <tr>
            <td>Resend Free</td>
            <td>3,000 emails/month, 100/day</td>
            <td>Transactional emails, invites, notifications</td>
          </tr>
          <tr>
            <td>Google APIs</td>
            <td>Free within quota</td>
            <td>Calendar sync, Google Meet, OAuth</td>
          </tr>
        </tbody>
      </table>

      <p>
        A solo freelancer or small team will hit none of these limits in normal use.
        When you outgrow them, each service offers a cheap paid upgrade with no data migration needed.
      </p>
    </div>
  );
}
