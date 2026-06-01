# Swapill - منصة تبادل المهارات | Skill Exchange Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

## English

Swapill is a modern skill-exchange platform that connects people who want to share and learn different skills. Whether you're looking to teach your expertise or learn something new, Swapill makes skill swapping easy and accessible.

### Features

- 🔍 **Skill Discovery**: Browse and discover various skills offered by community members
- 💬 **Real-time Chat**: Built-in messaging system for seamless communication
- 👤 **User Profiles**: Comprehensive profiles showcasing skills and experience
- 🔄 **Skill Swapping**: Request and manage skill exchange arrangements
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌐 **Multi-language Support**: Arabic and English interface

### Technologies Used

- **Frontend**: React 19 with TypeScript
- **Build tool**: Vite 6 + Tailwind CSS v4 (`@tailwindcss/vite`)
- **Backend**: Supabase (Postgres + Auth + Storage + Realtime)
- **Real-time**: Supabase Realtime channels for chat, presence, and notifications
- **State Management**: React Context API
- **Routing**: React Router v7
- **Icons**: Lucide React

---

## العربية

سوابل هي منصة حديثة لتبادل المهارات تربط بين الأشخاص الذين يرغبون في مشاركة وتعلم مهارات مختلفة. سواء كنت تريد تعليم خبراتك أو تعلم شيء جديد، سوابل تجعل تبادل المهارات سهلاً ومتاحاً للجميع.

### المميزات

- 🔍 **اكتشاف المهارات**: تصفح واكتشف المهارات المختلفة المقدمة من أعضاء المجتمع
- 💬 **دردشة فورية**: نظام مراسلة مدمج للتواصل السلس
- 👤 **ملفات تعريف المستخدمين**: ملفات تعريف شاملة تعرض المهارات والخبرات
- 🔄 **تبادل المهارات**: طلب وإدارة ترتيبات تبادل المهارات
- 📱 **تصميم متجاوب**: يعمل بسلاسة على أجهزة الكمبيوتر والهاتف
- 🌐 **دعم متعدد اللغات**: واجهة باللغتين العربية والإنجليزية

### التقنيات المستخدمة

- **الواجهة الأمامية**: React 19 مع TypeScript
- **أداة البناء**: Vite 6 + Tailwind CSS v4 (`@tailwindcss/vite`)
- **الواجهة الخلفية**: Supabase (قاعدة بيانات + مصادقة + تخزين + Realtime)
- **الوقت الفعلي**: قنوات Supabase Realtime للدردشة والحضور والإشعارات
- **إدارة الحالة**: React Context API
- **التوجيه**: React Router v7
- **الأيقونات**: Lucide React

---

## Installation / التثبيت

1. Clone the repository:
```bash
git clone https://github.com/maryamkhaledd84/swapill-app.git
cd swapill-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables / متغيرات البيئة

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> The repo also ships with a hardcoded fallback in `src/config/supabase.ts` so the app boots without an `.env` against a shared dev project. For your own deployment, always set the env vars above.

## Database Setup / إعداد قاعدة البيانات

The canonical schema lives in [`supabase/init.sql`](./supabase/init.sql). The chained files under `supabase/migrations/` are historical and conflict with each other — **don't apply them**. Use `init.sql` as the single source of truth.

### What `init.sql` provisions

- Tables: `profiles`, `skills`, `swap_requests`, `conversations`, `messages`
- RLS policies on every table (public read for profiles/skills, owner-write everywhere else)
- `auth.users → profiles` insert trigger (`handle_new_user`) that auto-creates a profile row on signup
- `set_updated_at` triggers for `profiles` and `swap_requests`
- Public storage bucket `avatars` with owner-only write policies
- A seed block that creates 100 demo users (email `seed_user_NNN@swapill.test`, password `Password123!`)

### Initial install (fresh project)

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the dashboard.
3. Paste the entire contents of `supabase/init.sql` and run it. This drops & recreates the `public` schema, so it's only safe on a brand-new project (or a dev project you're OK to wipe).
4. Copy your project's **Project URL** and **anon key** into your `.env`.
5. Reload the schema cache: in **API Docs → Reload schema** (or run `NOTIFY pgrst, 'reload schema';`).

### Optional: enable message attachments

To enable file/image attachments in chat, run [`supabase/attachments.sql`](./supabase/attachments.sql) once after `init.sql`. It:

- Adds `attachment_url`, `attachment_name`, `attachment_mime` columns to `messages`
- Makes `messages.content` nullable (so attachment-only messages work)
- Creates a public `attachments` storage bucket with owner-write policies
- Reloads PostgREST schema cache

### Optional: extra seed data

Two extra seed scripts are useful for local development:

- [`supabase/seed_egyptian.sql`](./supabase/seed_egyptian.sql) — adds 100 named Egyptian seed users (email pattern `<first>.<last>@swapill.test`, same password `Password123!`)
- [`supabase/reseed_skills.sql`](./supabase/reseed_skills.sql) — replaces the random skills attached to each seed user with category-coherent ones (so a user listed as a `cooking` expert only has cooking skills)

Run these only after `init.sql` has finished. They're idempotent enough to re-run if you tweak categories.

### Re-running

`init.sql` does `DROP SCHEMA public CASCADE` at the top, so re-running it wipes everything and starts over. If you want to add a single change without resetting (e.g. adding a column), write a one-off SQL snippet and run it through the SQL Editor — don't reach for the legacy files in `supabase/migrations/`.

### Auth providers (optional)

Email/password works out of the box once `init.sql` has run. Google/GitHub OAuth are wired in `Login`/`Signup` as "coming soon" placeholders — to enable them:

1. Supabase **Authentication → Providers**: enable Google and/or GitHub, paste in the OAuth client ID + secret.
2. Add the redirect URI to your provider:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Re-enable the live OAuth handler in `src/pages/Login.tsx` and `src/pages/Signup.tsx` (replace `handleOAuthComingSoon` with `signInWithOAuth`).
4. The route `/auth/callback` is already wired in `src/App.tsx` and routes to `src/pages/AuthCallback.tsx`.

## Deployment / النشر

### Build

```bash
npm run build      # produces dist/
npm run preview    # serves the built bundle locally on :3000
npm run lint       # runs tsc --noEmit
```

### Vercel / Netlify

`vercel.json` is already in the repo. To deploy:

1. Push the repo to GitHub.
2. Import it on Vercel (or your host of choice).
3. Set the env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project settings.
4. Build command: `npm run build`. Output directory: `dist`.

### Hosting notes

- The app is a single-page app — make sure your host rewrites every unknown route to `/index.html` (Vercel does this automatically; for Netlify add a redirect rule).
- After deploying, add your production origin (`https://your-domain.com`) to **Supabase → Authentication → URL Configuration → Site URL** so OAuth and password resets redirect correctly.
- If you enable OAuth, also add `https://your-domain.com/auth/callback` to the provider's authorized redirects.

## Project Structure / هيكل المشروع

```
swapill-app/
├── src/
│   ├── components/          # React components
│   │   ├── layout/        # Layout components
│   │   ├── dashboard/     # Dashboard components
│   │   └── shared/        # Shared components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   └── hooks/            # Custom hooks
├── supabase/             # Database migrations and setup
├── public/               # Static assets
└── README.md
```

## Contributing / المساهمة

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License / الرخصة

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact / التواصل

For questions and support, please reach out to:
- GitHub: [@maryamkhaledd84](https://github.com/maryamkhaledd84)
- Email: your-email@example.com

---

<div align="center">
  <p>Made with ❤️ by Maryam Khalid</p>
  <p>صُنعت بحب ❤️ من قبل مريم خالد</p>
</div>
