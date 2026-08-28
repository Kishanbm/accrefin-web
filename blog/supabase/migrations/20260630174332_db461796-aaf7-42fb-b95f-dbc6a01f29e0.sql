
-- 1) Enrich articles with all editorial fields admin can control
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS secondary_image_url text,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_moments jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pull_quote text,
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text;

-- 2) Fix the broken Berlin Metro cover image
UPDATE public.articles
SET cover_image_url = 'https://images.unsplash.com/photo-1527268835115-be8ff4ff5dec?w=1600&q=80'
WHERE slug = 'berlin-metro-acoustics';

-- 3) Backfill rich content for every existing article so detail pages feel complete
UPDATE public.articles SET
  secondary_image_url = COALESCE(secondary_image_url,
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80'),
  pull_quote = COALESCE(pull_quote,
    'The most interesting work is happening at the edges — where craft, technology, and culture collide.'),
  key_moments = CASE WHEN jsonb_array_length(key_moments) = 0 THEN
    '[
      {"title":"What changed","body":"A shift in the underlying landscape reshaped how the work gets made."},
      {"title":"Why it matters","body":"The implications stretch from independent makers to the largest institutions."},
      {"title":"Who to watch","body":"A handful of voices have moved from outsider to indispensable inside the last year."},
      {"title":"What to read next","body":"Three pieces, one short film, and a Sunday-morning longread to round it out."}
    ]'::jsonb ELSE key_moments END,
  questions = CASE WHEN jsonb_array_length(questions) = 0 THEN
    '[
      {"q":"Why now?","a":"A combination of better tools and lower friction has finally made the experiment cheap enough to run at scale."},
      {"q":"Who is leading the conversation?","a":"A loose collective of practitioners, critics, and a surprising number of independent writers."},
      {"q":"What should I read first?","a":"Start with the primary sources — the rest of the discourse only makes sense once you have the texts in hand."},
      {"q":"How do I get involved?","a":"Subscribe to one newsletter, attend one event, and write one short response. That is the entire on-ramp."}
    ]'::jsonb ELSE questions END,
  gallery_images = CASE WHEN jsonb_array_length(gallery_images) = 0 THEN
    jsonb_build_array(
      cover_image_url,
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80'
    ) ELSE gallery_images END,
  instagram_url = COALESCE(instagram_url, 'https://instagram.com/provenance'),
  facebook_url = COALESCE(facebook_url, 'https://facebook.com/provenance'),
  twitter_url = COALESCE(twitter_url, 'https://twitter.com/provenance'),
  linkedin_url = COALESCE(linkedin_url, 'https://linkedin.com/company/provenance')
WHERE true;

-- 4) Comments table — readers can read approved comments, authenticated users can post
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  body text NOT NULL,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.comments TO anon, authenticated;
GRANT INSERT ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public reads approved comments" ON public.comments;
CREATE POLICY "public reads approved comments" ON public.comments
  FOR SELECT TO anon, authenticated USING (approved = true);

DROP POLICY IF EXISTS "auth users insert comments" ON public.comments;
CREATE POLICY "auth users insert comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admins manage comments" ON public.comments;
CREATE POLICY "admins manage comments" ON public.comments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5) Seed 3 demo comments per article so threads feel lived-in
INSERT INTO public.comments (article_id, author_name, body, created_at)
SELECT a.id, c.name, c.body, now() - (c.days || ' days')::interval
FROM public.articles a
CROSS JOIN (VALUES
  ('Joanna Wellick', 'I''m so glad I found your site. Your posts are consistently excellent.', '12'),
  ('Allan Fleming', 'I''m honored to hear that. I''m always striving to provide the best information possible.', '11'),
  ('Marcus Halberstam', 'Your dedication to providing quality content is truly admirable. I''m a fan of your work.', '7')
) AS c(name, body, days)
WHERE NOT EXISTS (SELECT 1 FROM public.comments WHERE article_id = a.id);
