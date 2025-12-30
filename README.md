# Personal AI Operating System (NEXUS)

A futuristic, high-performance productivity SaaS built with Next.js 14, Supabase, and Tailwind CSS.

## Features

### 🧠 Command Center (Dashboard)
- **Discipline Score**: Live metric calculated from daily habit completion.
- **Mission Control**: Overview of pending high-priority tasks.
- **Streaks**: Real-time habit tracking.

### ✅ Task Management
- **Smart Status**: Auto-detection of "Missed" tasks based on due dates.
- **Priority System**: High/Medium/Low designations.
- **Optimistic UI**: Instant interactions with background syncing.

### ⚡ Habit Protocols
- **Daily Logging**: Track core habits (Learning, Deep Work, etc.).
- **System Initialization**: One-click setup of standard protocols.
- **Analytics**: Streak tracking and completion rates.

### 📊 Reviews & AI
- **Daily Reviews**: End-of-day reflection logging with ratings.
- **AI Insights**: (Simulated) Pattern analysis and recommendations.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: Supabase (PostgreSQL, Auth, RLS).
- **Communication**: REST API Routes + Server Actions (hybrid).
- **Performance**: Server Components for data fetching, Client Components for interaction.

## Getting Started

1. **Environment Setup**:
   Create `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

2. **Database Setup**:
   Run the schema in `supabase/schema.sql` in your Supabase SQL Editor.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Security

- **Row Level Security (RLS)**: Enabled on all tables. Users can only access their own data.
- **Auth**: Supabase Auth integration for secure sessions.
