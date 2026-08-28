ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS layout_size text NOT NULL DEFAULT 'standard';
-- allowed values used by frontend: 'hero_large' | 'spotlight_single' | 'two_col' | 'standard'
COMMENT ON COLUMN public.articles.layout_size IS 'Homepage placement hint: hero_large (top hero), spotlight_single (full-width single card row), two_col (paired with another), standard (grid).';
CREATE INDEX IF NOT EXISTS articles_layout_size_idx ON public.articles(layout_size);