
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS nav_position text NOT NULL DEFAULT 'more';

-- Promote the first 4 (by sort_order) to primary
WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY sort_order, name) AS rn
  FROM public.categories
)
UPDATE public.categories c
   SET nav_position = 'primary'
  FROM ranked r
 WHERE c.id = r.id AND r.rn <= 4;
