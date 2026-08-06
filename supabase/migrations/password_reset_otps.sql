-- Password reset OTPs table
-- Run this in Supabase SQL Editor

create table if not exists password_reset_otps (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  otp text not null,
  expires_at timestamptz not null,
  used boolean default false,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Index for fast lookup
create index if not exists idx_password_reset_otps_email on password_reset_otps(email);

-- Auto-delete expired rows after 1 hour (optional cleanup)
-- You can run this manually or set up a pg_cron job
