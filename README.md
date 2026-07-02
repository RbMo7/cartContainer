# cartContainer

**Open-source ecommerce boilerplate/demo system.** Built with Next.js 16, TypeScript, and SQLite. Product catalog, cart, checkout, orders, and admin dashboard — ready to run locally in 30 seconds.

```
npm run dev  →  http://localhost:3000
```

## Quick Start

```bash
git clone https://github.com/RbMo7/cartContainer
cd cartContainer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cartcontainer.com | admin123 |
| Customer | demo@cartcontainer.com | demo123 |

## Features

### Storefront
- **Product catalog** — Browse by category, featured products on homepage
- **Product detail** — Images, pricing, stock status, add to cart
- **Shopping cart** — Add/remove items, update quantities
- **Checkout** — Stripe payment flow (test mode)
- **Order history** — View past orders and status

### Admin Dashboard
- **Overview** — Product, order, and user counts
- **Product management** — View products, toggle featured status
- **Order management** — Advance orders through status pipeline (pending → paid → shipped → delivered)
- **Seed data** — One-click product seeding for demo

### Auth
- Email/password registration and login
- JWT sessions via NextAuth v5
- Role-based access (admin vs customer)
- Protected routes and API actions

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS |
| **Database** | SQLite via Prisma v7 + libSQL adapter |
| **Auth** | NextAuth v5 (Credentials) |
| **Payments** | Stripe (test mode) |
| **Deploy** | Vercel-ready |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage — featured products
│   ├── products/             # Product catalog + detail
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout (Stripe redirect)
│   ├── orders/               # Order history + detail
│   ├── auth/                 # Sign in / sign up
│   └── admin/                # Admin dashboard
├── components/
│   └── product-card.tsx      # Shared product card
├── lib/
│   ├── db.ts                 # Prisma client (SQLite adapter)
│   ├── auth.ts               # NextAuth configuration
│   ├── actions.ts            # Server actions (cart, checkout, admin)
│   ├── queries.ts            # Data fetching helpers
│   └── stripe.ts             # Stripe client
└── types/
    └── next-auth.d.ts        # Auth type extensions
```

## Why SQLite?

Zero configuration. Clone the repo, run `npm run dev`, and the database is created automatically. Perfect for local development, demos, and testing. Swap to Postgres via Prisma adapter when deploying to production.

## Environment Variables

Copy `.env.example` to `.env` — defaults work for local development with SQLite. Stripe keys are only needed for live payment processing.

## License

MIT
