# CeeqCare UI

Next.js frontend scaffold for CareSight AI.

## Auth Setup

The auth client is wired to the NestJS backend endpoints:

- `POST /auth/register-agency`
- `POST /auth/login`
- `GET /auth/me`

Set the API URL in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/login`.

## Scripts

- `npm run dev` - start the Next.js dev server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run ESLint
