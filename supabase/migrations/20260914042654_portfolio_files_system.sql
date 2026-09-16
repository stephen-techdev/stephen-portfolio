/*
# Portfolio Files System — Owner Auth, File Metadata, Storage Bucket

## Overview
Creates a secure file management system for the portfolio owner to upload/replace
profile photo, resume, and CV. Public visitors get read-only access to download
files. Owner authentication is handled via an edge function that verifies a
server-side password and issues a short-lived signed token.

## New Tables
- `portfolio_files`
  - `id` (uuid, primary key)
  - `file_type` (text, one of: 'photo', 'resume', 'cv')
  - `storage_path` (text, path in storage bucket)
  - `file_name` (text, original filename)
  - `mime_type` (text)
  - `updated_at` (timestamptz, defaults to now())
  - Only one row per file_type (enforced by unique constraint)

## Security
- RLS enabled on `portfolio_files`
- Public SELECT (anon, authenticated) so visitors can see which files exist
- All INSERT/UPDATE/DELETE restricted to `service_role` only (edge function uses service role key)
- Storage bucket `portfolio-files` is public for reads, writes restricted to service_role
*/

CREATE TABLE IF NOT EXISTS portfolio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_type text NOT NULL CHECK (file_type IN ('photo', 'resume', 'cv')),
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Ensure only one row per file_type
CREATE UNIQUE INDEX IF NOT EXISTS portfolio_files_file_type_key ON portfolio_files (file_type);

ALTER TABLE portfolio_files ENABLE ROW LEVEL SECURITY;

-- Public can read which files exist (needed to display photo, show resume/cv buttons)
DROP POLICY IF EXISTS "public_read_portfolio_files" ON portfolio_files;
CREATE POLICY "public_read_portfolio_files"
  ON portfolio_files FOR SELECT
  TO anon, authenticated USING (true);

-- No INSERT/UPDATE/DELETE policies for anon/authenticated — only service_role can modify
-- (service_role bypasses RLS, used by the edge function)

-- Create storage bucket for portfolio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, service_role only write
DROP POLICY IF EXISTS "public_read_portfolio_storage" ON storage.objects;
CREATE POLICY "public_read_portfolio_storage"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-files');

-- No INSERT/UPDATE/DELETE storage policies for anon/authenticated
-- service_role bypasses RLS for writes