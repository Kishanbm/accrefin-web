-- Ensure the media storage bucket exists (policies already applied in earlier migration)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Re-assert storage policies for the media bucket
DROP POLICY IF EXISTS "Read media" ON storage.objects;
CREATE POLICY "Read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admins write media" ON storage.objects;
CREATE POLICY "Admins write media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'media' AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Admins update media" ON storage.objects;
CREATE POLICY "Admins update media" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'media' AND public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;
CREATE POLICY "Admins delete media" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'media' AND public.has_role(auth.uid(), 'admin')
  );

-- Default site settings (safe if already present)
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'TECHQWAZ'),
  ('theme_color', '#0f766e'),
  ('logo_url', '')
ON CONFLICT (key) DO NOTHING;
