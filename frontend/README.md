OneHealthline Connect Frontend

This is the Next.js (App Router) + TailwindCSS + TypeScript implementation for the platform.

Setup

1. npm install
2. Create .env.local with NEXT_PUBLIC_API_URL= http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io/api
3. npm run dev

Notes

- Role-based protection via src/middleware.ts
- Auth handled in src/context/AuthContext.tsx
- APIs centralized in src/lib/api.ts

