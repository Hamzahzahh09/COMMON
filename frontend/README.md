# COMMON — Frontend

This folder is reserved for the COMMON frontend application.

## 🛠️ Planned Tech Stack

* **Framework**: [SvelteKit](https://kit.svelte.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Component Library**: [shadcn-svelte](https://shadcn-svelte.com/)
* **Backend Integration**: Supabase JavaScript Client (`@supabase/supabase-js`)
* **TypeScript Types**: Shared database types located at `../backend/types/database.types.ts`

## 🚀 Setup Instructions (When Ready to Initialize)

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Fill in `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` from your Supabase project settings.
3. Import the generated database types from `../backend/types/database.types.ts`.
