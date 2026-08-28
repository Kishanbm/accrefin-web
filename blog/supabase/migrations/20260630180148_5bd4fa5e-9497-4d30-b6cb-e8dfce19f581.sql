
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
