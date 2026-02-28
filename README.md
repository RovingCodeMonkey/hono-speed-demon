# hono-speed-demon

Tinkering with a hono API and sqlLite
(The robots made me do it)

# My Hono App (10k DAU Project)

A high-performance, low-cost API built with the "Golden Stack" principles.

## 🚀 Tech Stack

- **Frontend:** React (Vite) hosted on S3 + CloudFront
- **API:** Hono (Node.js) on AWS Lightsail ($3.50/mo)
- **Database:** SQLite with Drizzle ORM (WAL Mode enabled)
- **Deployment:** GitHub Actions + PM2 + Nginx

## 🛠 Setup & Commands

- `npm run dev` - Start Hono locally
- `npx drizzle-kit push` - Sync local SQLite schema
- `pm2 reload hono-api` - Production reload

## 🔐 Environment Variables (Lightsail .env)

- `GITHUB_ID`, `GITHUB_SECRET`, `JWT_SECRET`, `FRONTEND_URL`
