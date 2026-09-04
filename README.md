# Bulusan Zoo Next.js migration

This folder is the unified Next.js 16 App Router migration. The original `frontend` and `backend` folders remain unchanged.

## Run

1. Copy `.env.example` to `.env.local` and provide the same database and integration credentials used by the existing backend.
2. Install dependencies with `npm install`.
3. Start development with `npm run dev`.
4. Open `http://localhost:3000`.

The browser defaults to same-origin `/api` requests. Existing `/api/*` and `/auth/*` contracts are served through Node.js App Router route handlers backed by the migrated controllers, models, middleware, and routes under `src/server`.

The existing non-destructive schema ensure routines start on the first API request instead of during `next build`. Their failures remain non-fatal, matching the original server behavior.

## Architecture

- `src/app`: App Router layouts, pages, metadata, manifest, and route handlers.
- `src/components`, `src/views`: preserved UI and feature implementations.
- `src/services`: browser API, AI model, and integration clients.
- `src/server`: migrated Express business logic, database models, uploads, auth, payments, email, and integrations.
- `public`: all existing assets, TensorFlow model, Leaflet distribution, and images.

The API compatibility adapter is intentionally Node-runtime-only because MySQL, Multer, Cloudinary, Nodemailer, and cryptographic integrations cannot run at the Edge.
