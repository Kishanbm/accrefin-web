
-- Editor role
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid=e.enumtypid WHERE t.typname='app_role' AND e.enumlabel='editor') THEN
    ALTER TYPE public.app_role ADD VALUE 'editor';
  END IF;
END $$;

-- Editor permissions
CREATE TABLE IF NOT EXISTS public.editor_permissions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  can_edit_others BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.editor_permissions TO authenticated;
GRANT ALL ON public.editor_permissions TO service_role;
ALTER TABLE public.editor_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "editor_perm_self_read" ON public.editor_permissions;
CREATE POLICY "editor_perm_self_read" ON public.editor_permissions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "editor_perm_admin_all" ON public.editor_permissions;
CREATE POLICY "editor_perm_admin_all" ON public.editor_permissions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Articles: extra columns
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS blocks JSONB,
  ADD COLUMN IF NOT EXISTS cover_image JSONB,
  ADD COLUMN IF NOT EXISTS secondary_image JSONB,
  ADD COLUMN IF NOT EXISTS tags_text TEXT;

-- backfill cover_image jsonb from URL
UPDATE public.articles
   SET cover_image = jsonb_build_object('url', cover_image_url, 'alt', title, 'focal_x', 0.5, 'focal_y', 0.5)
 WHERE cover_image IS NULL AND cover_image_url IS NOT NULL;
UPDATE public.articles
   SET secondary_image = jsonb_build_object('url', secondary_image_url, 'alt', title, 'focal_x', 0.5, 'focal_y', 0.5)
 WHERE secondary_image IS NULL AND secondary_image_url IS NOT NULL;

-- Ad slots: image jsonb
ALTER TABLE public.ad_slots ADD COLUMN IF NOT EXISTS image JSONB;
UPDATE public.ad_slots
   SET image = jsonb_build_object('url', image_url, 'alt', COALESCE(title,label), 'focal_x', 0.5, 'focal_y', 0.5)
 WHERE image IS NULL AND image_url IS NOT NULL;

-- Articles policies: allow editors to manage
DROP POLICY IF EXISTS "articles_editor_insert" ON public.articles;
CREATE POLICY "articles_editor_insert" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'editor') AND author_user_id = auth.uid())
  );
DROP POLICY IF EXISTS "articles_editor_update" ON public.articles;
CREATE POLICY "articles_editor_update" ON public.articles
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'editor') AND author_user_id = auth.uid())
    OR (public.has_role(auth.uid(),'editor') AND EXISTS (
        SELECT 1 FROM public.editor_permissions ep WHERE ep.user_id = auth.uid() AND ep.can_edit_others = true
    ))
  );
DROP POLICY IF EXISTS "articles_editor_delete" ON public.articles;
CREATE POLICY "articles_editor_delete" ON public.articles
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR (public.has_role(auth.uid(),'editor') AND author_user_id = auth.uid())
  );

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tags_public_read" ON public.tags;
CREATE POLICY "tags_public_read" ON public.tags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "tags_admin_write" ON public.tags;
CREATE POLICY "tags_admin_write" ON public.tags FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);
GRANT SELECT ON public.article_tags TO anon, authenticated;
GRANT ALL ON public.article_tags TO service_role;
GRANT INSERT, DELETE ON public.article_tags TO authenticated;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "article_tags_public_read" ON public.article_tags;
CREATE POLICY "article_tags_public_read" ON public.article_tags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "article_tags_admin_write" ON public.article_tags;
CREATE POLICY "article_tags_admin_write" ON public.article_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- Newsletter popups (per-scope/category)
CREATE TABLE IF NOT EXISTS public.newsletter_popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL DEFAULT 'global', -- 'global' | 'category'
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  body TEXT,
  cta_label TEXT DEFAULT 'Subscribe',
  image JSONB,
  enabled BOOLEAN NOT NULL DEFAULT true,
  scroll_trigger_pct INTEGER NOT NULL DEFAULT 60,
  delay_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_popups_global_uq
  ON public.newsletter_popups ((scope)) WHERE scope = 'global';
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_popups_cat_uq
  ON public.newsletter_popups (category_id) WHERE scope = 'category';
GRANT SELECT ON public.newsletter_popups TO anon, authenticated;
GRANT ALL ON public.newsletter_popups TO service_role;
ALTER TABLE public.newsletter_popups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "newsletter_popups_public_read" ON public.newsletter_popups;
CREATE POLICY "newsletter_popups_public_read" ON public.newsletter_popups FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "newsletter_popups_admin_write" ON public.newsletter_popups;
CREATE POLICY "newsletter_popups_admin_write" ON public.newsletter_popups FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Seed one global newsletter
INSERT INTO public.newsletter_popups (scope, headline, body, cta_label)
SELECT 'global', 'Keep up to date with the most important stories.', 'Weekly editorial picks delivered to your inbox.', 'Subscribe'
WHERE NOT EXISTS (SELECT 1 FROM public.newsletter_popups WHERE scope='global');

-- Seed per-category newsletters for existing categories
INSERT INTO public.newsletter_popups (scope, category_id, headline, body, cta_label)
SELECT 'category', c.id,
       'Stay ahead in ' || c.name || '.',
       'The best of ' || c.name || ', curated weekly.',
       'Subscribe'
  FROM public.categories c
 WHERE NOT EXISTS (SELECT 1 FROM public.newsletter_popups n WHERE n.category_id = c.id);
