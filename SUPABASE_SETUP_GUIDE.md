# Supabase Setup, Security & Realtime Guide

Your confession website is integrated with Supabase (`@supabase/supabase-js`) for database persistence, Authentication, Row Level Security (RLS), and Realtime live updates.

---

## 1. Environment Variables
Set these in `.env` (already configured locally, gitignored) and in your hosting provider's environment settings before deploying:

```env
VITE_SUPABASE_URL=https://qummihwkdjgywuzjredt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3v-u_kirGlvBSWLspg002Q_9LZBc1HM
```

---

## 2. Create Tables, RLS Policies & Realtime
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. Go to **SQL Editor** -> **New query**.
3. Copy and run the entire contents of `supabase/schema.sql`.
   This creates:
   - `public.confession_responses` (with `unique` constraint on `invitation_id`, `YES`/`NO` check constraint, and `submitted_at` timestamp).
   - `public.invitation_opens` (tracks when the recipient presses **Start**).
   - **Row Level Security (RLS)** so visitors can submit once (`INSERT`) without ever reading (`SELECT`), editing (`UPDATE`), or deleting (`DELETE`) any records.
   - **Supabase Realtime** publication on both tables so `/admin` updates instantaneously.

---

## 3. Create Ishaac's Private Admin Account
1. In your Supabase Dashboard, go to **Authentication** -> **Users** -> **Add user** -> **Create new user**.
2. Enter Ishaac's email and a strong password, and check **Auto Confirm User**.
3. Go to **Authentication** -> **Sign In / Providers** -> **Email** and **disable "Allow new users to sign up"** (or restrict RLS `using (auth.jwt() ->> 'email' = 'your@email.com')` in `supabase/schema.sql`) so no stranger can create an account and access `/admin`.

---

## 4. Test Before Sending to Irish
1. Visit `/` and play through to the confession page.
2. Open `/admin` in a second tab or another device and sign in with your Supabase Auth credentials.
3. Submit a test **YES** or **NO** on `/`:
   - Confirm Irish sees the celebratory or respectful confirmation message.
   - Confirm `/admin` receives the new row via **Supabase Realtime** immediately without refreshing.
4. Click **Reset Test Submission** inside `/admin` so the database returns to `"Still waiting for a little answer..."` before sharing the link with Irish.
