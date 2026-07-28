-- ============================================================
-- Support Tickets System
-- support_tickets  — one row per conversation thread
-- ticket_messages  — one row per message (inbound + outbound)
--
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Auto-increment ticket number sequence
CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START 1;

CREATE TABLE IF NOT EXISTS support_tickets (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number  TEXT        NOT NULL UNIQUE DEFAULT 'TKT-' || LPAD(nextval('support_ticket_seq')::TEXT, 5, '0'),
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  subject        TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'open',  -- open | replied | closed
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id     UUID        NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  direction     TEXT        NOT NULL,   -- 'inbound' | 'outbound'
  sender_name   TEXT,
  sender_email  TEXT,
  body          TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status     ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email      ON support_tickets(email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id  ON ticket_messages(ticket_id);

-- RLS — service role only (all access via admin API routes)
ALTER TABLE support_tickets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages  ENABLE ROW LEVEL SECURITY;

-- No public policies — only service role (bypasses RLS) can read/write
-- This keeps tickets fully private to admins only
