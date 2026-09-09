<div align="center">

# ⚡ RayCodeAI Reviewer
### *Autonomous, Context-Aware AI Code Reviews on Every Pull Request*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Inngest](https://img.shields.io/badge/Inngest-Durable_Workflows-FF5A5F?style=for-the-badge&logo=inngest)](https://www.inngest.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_RAG-000000?style=for-the-badge&logo=pinecone)](https://www.pinecone.io/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-OAuth2-yellow?style=for-the-badge)](https://better-auth.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Subscriptions-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)

<br />

**RayCodeAI Reviewer** is an enterprise-grade, event-driven AI code review platform. By combining **GitHub Apps**, **Inngest durable background workflows**, **Pinecone vector embeddings (RAG)**, and **OpenRouter LLMs**, it provides intelligent, contextual, and actionable code reviews directly inside your pull requests within seconds of opening.

[Key Features](#-key-features) • [Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Environment Variables](#-environment-variables) • [GitHub App Setup](#-github-app-setup)

</div>

---

## 🌟 Key Features

- 🤖 **Context-Aware AI Code Reviews**:
  Unlike simple diff analyzers, RayCodeAI leverages full codebase indexing. Reviews take into account existing project architecture, utilities, and patterns using vector search.
- ⚡ **Durable Event-Driven Pipeline**:
  Powered by **Inngest**, ensuring every step (diff chunking, embedding generation, vector indexing delay, AI synthesis, and PR commenting) is fault-tolerant, retryable, and resilient against rate limits and server crashes.
- 📦 **Pinecone Vector Database (RAG)**:
  Uses `llama-text-embed-v2` with namespace isolation per repository and pull request for fast, relevant semantic retrieval.
- 🔄 **On-Demand Codebase Syncing**:
  Syncs entire repositories in the background to build a comprehensive knowledge base for deeper architectural reviews.
- 🔐 **Secure Cryptographic Verification**:
  Every incoming GitHub and Razorpay webhook is validated using `HMAC-SHA256` signatures to prevent forged requests and token drainage.
- 🛡️ **Modern Authentication with Better Auth**:
  Frictionless GitHub OAuth sign-in with HTTP-only session cookies and Prisma adapter.
- 💳 **Monetization & Tiered Subscriptions**:
  Integrated with **Razorpay Subscriptions** offering Free (5 reviews/month) and Pro (unlimited reviews) tiers with real-time signature verification and automated rate-limiting.
- 🎨 **Sleek, Accessible UI**:
  Built with Next.js 16 App Router, Tailwind CSS v4, Base UI / Radix primitives, theme toggle (Dark/Light mode), Sonner toasts, and dynamic dashboard metrics.

---

## 🏗️ System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant GH as GitHub (Repo & App)
    participant Webhook as Next.js API (/api/github/webhook)
    participant Inngest as Inngest Workflow Engine
    participant Pinecone as Pinecone Vector DB
    participant AI as OpenRouter / Vercel AI SDK
    participant DB as PostgreSQL (Neon + Prisma)

    Dev->>GH: Opens or Updates Pull Request
    GH->>Webhook: Sends HMAC-Signed 'pull_request' Webhook (POST)
    Webhook->>Webhook: Validates x-hub-signature-256 (HMAC-SHA256)
    Webhook->>DB: Upserts PullRequest record & checks monthly quota
    Webhook->>Inngest: Triggers 'github/pr.received' event
    Webhook-->>GH: 200 OK (Received)

    Note over Inngest: Durable Execution Starts
    Inngest->>DB: Step 1: Mark status = "processing"
    Inngest->>GH: Step 2: Fetch PR unified diffs via Octokit
    Inngest->>Pinecone: Step 3: Chunk diffs & store in PR namespace
    Inngest->>Inngest: Step 4: Durable sleep (10s for index convergence)
    Inngest->>Pinecone: Step 5: Query repo context (RAG) using PR title & diff
    Inngest->>AI: Step 6: Generate review with checklist (Security, Logic, Perf)
    AI-->>Inngest: Markdown Review Response
    Inngest->>GH: Step 7: Post review comment on PR conversation
    Inngest->>DB: Step 8: Update PR status = "reviewed" & save comment
```

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server Components, Server Actions, Route Handlers |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) + [Radix / Base UI](https://base-ui.com/) | Curated styling, animations, responsive sidebar |
| **Icons & Notifications** | Lucide Icons, Phosphor Icons, [Sonner](https://sonner.emilkowal.ski/) | Clean UI indicators and interactive notifications |
| **Authentication** | [Better Auth](https://better-auth.com/) | GitHub OAuth provider, session tokens, Next.js cookies |
| **Database** | [PostgreSQL (Neon Serverless)](https://neon.tech/) | Cloud database with connection pooling |
| **ORM** | [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` | Typed database client, migrations, schema modeling |
| **Background Jobs** | [Inngest 4](https://www.inngest.com/) | Durable workflow execution, automatic retries, step caching |
| **Vector Search (RAG)**| [Pinecone](https://www.pinecone.io/) | Semantic vector search with `llama-text-embed-v2` |
| **AI / LLM** | [Vercel AI SDK](https://sdk.vercel.ai/) + [OpenRouter](https://openrouter.ai/) | Multi-model LLM access for automated code analysis |
| **GitHub Integration**| [Octokit](https://github.com/octokit) | GitHub App installation tokens, webhooks, PR comments |
| **Payments** | [Razorpay](https://razorpay.com/) | Subscriptions, billing status, instant payment verification |
| **Client State** | [TanStack React Query v5](https://tanstack.com/query) | Asynchronous cache and optimistic queries |

---

## 📂 Project Structure

```text
├── app/
│   ├── (auth)/                  # Public authentication routes (Sign In)
│   ├── (protected)/dashboard/   # Protected workspace (Repos, GitHub App, Settings)
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth Next.js route handler
│   │   ├── github/
│   │   │   ├── callback/        # Post-installation GitHub App redirect
│   │   │   ├── repos/           # Connected repository list endpoint
│   │   │   └── webhook/         # GitHub webhook listener (HMAC verified)
│   │   ├── inngest/             # Inngest serve handler & background functions
│   │   └── razorpay/webhook/    # Razorpay payment & subscription webhook
│   ├── globals.css              # Tailwind CSS v4 variables and base styles
│   └── layout.tsx               # Root layout with QueryProvider, ThemeProvider, Toaster
├── features/
│   ├── ai/                      # OpenRouter provider client
│   ├── auth/                    # Better Auth actions, proxy, and sign-in components
│   ├── billing/                 # Razorpay SDK, server actions, Upgrade/Cancel buttons
│   ├── dashboard/               # Layout shell, collapsible sidebar, navigation items
│   ├── github/                  # Octokit helper, installation utils, webhook handlers
│   ├── inngest/                 # Inngest client initialization
│   ├── pinecone/                # Pinecone vector index client
│   ├── repo-sync/               # Full-codebase RAG synchronization workflow
│   ├── reviews/                 # PR diff extraction, vectorization, AI review prompts
│   └── settings/                # User profile & subscription plan management
├── lib/
│   ├── auth.ts                  # Better Auth server configuration
│   ├── billing.ts               # Server actions for starting & confirming subscriptions
│   └── db.ts                    # Prisma Client with Neon PostgreSQL driver adapter
├── prisma/
│   └── schema.prisma            # Database schema models (User, PR, Session, etc.)
└── scripts/                     # Operational & debugging scripts
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v20.x or higher
- **pnpm**: v9.x or higher (`npm i -g pnpm`)
- **Accounts & API Keys**:
  - [Neon Database](https://neon.tech/) (PostgreSQL connection string)
  - [GitHub Account](https://github.com/) (to create a GitHub App)
  - [Inngest Account / Local CLI](https://www.inngest.com/)
  - [Pinecone Account](https://www.pinecone.io/) (Vector Index)
  - [OpenRouter Account](https://openrouter.ai/) (AI API key)
  - [Razorpay Account](https://razorpay.com/) (Test Key & Secret)
  - [Ngrok](https://ngrok.com/) (for tunneling webhooks locally)

---

### 1. Clone & Install

```bash
git clone https://github.com/rayyan4533/ai-powered-code-review.git
cd ai-powered-code-review
pnpm install
```

---

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in the required values:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="generate_a_random_32_char_secret_here"

# GitHub OAuth App (User Login)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# GitHub App (Bot & Webhooks)
GITHUB_APP_ID="your_github_app_id"
GITHUB_APP_NAME="your-app-slug"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET="your_custom_webhook_secret"
NEXT_PUBLIC_GITHUB_PUBLIC_LINK="https://github.com/apps/your-app-slug"

# Vector Database (Pinecone)
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="your_pinecone_index_name"

# AI Provider (OpenRouter)
OPENROUTER_APIKEY="your_openrouter_api_key"

# Inngest Background Jobs
INNGEST_DEV=1

# Billing (Razorpay)
RAZORPAY_API_KEY="rzp_test_..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
NEXT_PUBLIC_RAZORPAY_API_KEY="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_PLAN_ID="plan_..."
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

---

### 3. Initialize the Database

Push the Prisma schema to your PostgreSQL database and generate the Prisma client:

```bash
# Push schema to Neon
pnpm prisma db push

# Generate Prisma Client
pnpm prisma generate
```

---

### 4. Run Development Services

In separate terminal windows, start the required background services:

```bash
# Terminal 1: Next.js App
pnpm dev

# Terminal 2: Inngest Dev Server (local workflow dashboard)
pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest

# Terminal 3: Ngrok Tunnel (for GitHub webhooks)
ngrok http 3000
```

> [!TIP]
> Once running, access the services locally:
> - **Next.js Web App**: [http://localhost:3000](http://localhost:3000)
> - **Inngest Workflow Dashboard**: [http://localhost:8288](http://localhost:8288)
> - **Prisma Studio**: `pnpm prisma studio` &rarr; [http://localhost:5555](http://localhost:5555)

---

## ⚙️ GitHub App Setup

1. Go to **GitHub Settings &rarr; Developer Settings &rarr; GitHub Apps &rarr; New GitHub App**.
2. Set **Homepage URL** to `http://localhost:3000`.
3. Under **Identifying and authorizing users**:
   - **Callback URL**:
     ```text
     http://localhost:3000/api/auth/callback/github
     http://localhost:3000/api/github/callback
     ```
   - Check **Request user authorization (OAuth) during installation**.
4. Under **Webhook**:
   - **Webhook URL**: `https://your-ngrok-domain.ngrok-free.dev/api/github/webhook`
   - **Webhook Secret**: The same string as `GITHUB_WEBHOOK_SECRET` in your `.env`.
5. Under **Permissions**:
   - **Repository &rarr; Contents**: Read-only (to read files for codebase context)
   - **Repository &rarr; Pull requests**: Read & Write (to inspect diffs)
   - **Repository &rarr; Issues**: Read & Write (to post comments on PRs)
   - **Repository &rarr; Metadata**: Read-only
6. Under **Subscribe to events**:
   - Check **Pull request**.
7. Click **Create GitHub App**.
8. Generate a **Private Key** (`.pem` format) and download it.
   - Convert the private key to a single-line string with escaped newlines (`\n`) for `GITHUB_APP_PRIVATE_KEY` in `.env`.

---

## 📊 Database Schema Overview

```mermaid
erDiagram
    User ||--o{ Session : has
    User ||--o{ Account : links
    User ||--o| GithubInstallation : installs
    User {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string plan "free | pro"
        string razorpaySubscriptionId
        string subscriptionStatus "active | canceled | pending"
        datetime subscriptionRenewsAt
    }
    Session {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
    }
    GithubInstallation {
        string id PK
        string userId FK
        int installationId
        string accountLogin
        string accountType
    }
    PullRequest {
        string id PK
        int installationId
        string repoFullName
        int prNumber
        string title
        string headSha
        string status "pending | processing | reviewed | rate_limited"
        string reviewComment
    }
    RepoSync {
        string id PK
        int installationId
        string repoFullName UK
        string branch
        string status "pending | syncing | synced | failed"
        int chunkCount
    }
```

---

## 🎯 Review Process Checklist

When a pull request is analyzed, the AI reviews code across 6 core criteria:

1. **Correctness** — Functional bugs, edge cases, off-by-one errors, null checks.
2. **Security** — Injection vulnerabilities, authentication flaws, exposed secrets.
3. **Performance** — Redundant iterations, memory leaks, missing database indexes, unoptimized queries.
4. **Reliability** — Unhandled exceptions, missing timeouts, concurrency and race conditions.
5. **Readability & Standards** — Clean naming, clear abstractions, adherence to language idiomatic patterns.
6. **Maintainability** — Modular structure, DRY and SOLID principles.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/rayyan4533/ai-powered-code-review/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/rayyan4533">Mohammed Rayyan</a></sub>
</div>
