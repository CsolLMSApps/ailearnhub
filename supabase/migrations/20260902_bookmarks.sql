-- Bookmarks: learners flag specific modules to revisit
create table if not exists bookmarks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users on delete cascade not null,
  course_id     uuid references courses on delete cascade not null,
  module_number int not null,
  created_at    timestamptz default now() not null,
  unique (user_id, course_id, module_number)
);

-- Index for fast per-user lookups
create index if not exists bookmarks_user_id_idx on bookmarks (user_id);

-- RLS
alter table bookmarks enable row level security;

-- Users can only read their own bookmarks
create policy "bookmarks_select_own"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Users can insert their own bookmarks
create policy "bookmarks_insert_own"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can delete their own bookmarks
create policy "bookmarks_delete_own"
  on bookmarks for delete
  using (auth.uid() = user_id);
