-- Run this SQL in Supabase Dashboard → SQL Editor

-- Create users table for CivicAI auth
CREATE TABLE IF NOT EXISTS civicai_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow the anon key full access
-- since we're managing auth ourselves with JWT
ALTER TABLE civicai_users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations via anon key (our server handles auth logic)
CREATE POLICY "Allow all operations for anon" ON civicai_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert existing users (from your current users.json)
-- Passwords are already bcrypt hashed
INSERT INTO civicai_users (id, name, email, password, created_at) VALUES
  ('1777896117270', 'Test User', 'testuser@gmail.com', '$2b$10$O4da4OtZwjdn66OTz4WjCeExOTeQMB5XKxW4cNCCMg2LPqytfbg82', '2026-05-04T12:01:57.270Z'),
  ('1777896381312', 'Vikas', 'saraswatvikas33@gmail.com', '$2b$10$l7X4VWut/LkBqwepLqEzPuC6YtL/LGBR.kmaFsImuz50hrK0Q6XlS', '2026-05-04T12:06:21.312Z'),
  ('1777898229596', 'Test User', 'newuser999@gmail.com', '$2b$10$KSp3hgHKzzur6x3VdjlYB.iMVIr5nTpq.peef1rK1viIKxQ8YMSGm', '2026-05-04T12:37:09.596Z'),
  ('1777898273665', 'Praful', 'prafulkumar1401@gmail.com', '$2b$10$ljAYMqGyAd6Ouu9lUWVffuB4XziREtw7OB9a/XS7BMOT..Pks7aAy', '2026-05-04T12:37:53.665Z')
ON CONFLICT (email) DO NOTHING;
