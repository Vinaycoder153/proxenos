-- CLEANUP
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.reviews cascade;
drop table if exists public.daily_plans cascade;
drop table if exists public.habit_logs cascade;
drop table if exists public.habits cascade;
drop table if exists public.tasks cascade;
drop table if exists public.profiles cascade;
drop type if exists task_status;
drop type if exists task_priority;

-- Enable Row Level Security
-- alter table auth.users enable row level security; (Managed by Supabase)

-- PROFILES
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  email text,
  username text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- TASKS
create type task_priority as enum ('Low', 'Medium', 'High');
create type task_status as enum ('pending', 'completed', 'missed');

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  priority task_priority default 'Medium',
  due_date date,
  status task_status default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Users can CRUD own tasks" on public.tasks
  for all using (auth.uid() = user_id);


-- HABITS
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  icon text, -- stores icon name string
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.habits enable row level security;

create policy "Users can CRUD own habits" on public.habits
  for all using (auth.uid() = user_id);


-- HABIT LOGS
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  habit_id uuid references public.habits(id) on delete cascade not null,
  completed_at date default current_date not null,
  unique(user_id, habit_id, completed_at) -- Prevent duplicate logs for same day
);

alter table public.habit_logs enable row level security;

create policy "Users can CRUD own habit logs" on public.habit_logs
  for all using (auth.uid() = user_id);


-- DAILY PLANS
create table public.daily_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  date date default current_date not null,
  mission_statement text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

alter table public.daily_plans enable row level security;

create policy "Users can CRUD own daily plans" on public.daily_plans
  for all using (auth.uid() = user_id);


-- REVIEWS
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  date date default current_date not null,
  content text,
  rating integer check (rating >= 0 and rating <= 10),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

create policy "Users can CRUD own reviews" on public.reviews
  for all using (auth.uid() = user_id);
