
INSERT INTO public.categories (slug, name, description, sort_order) VALUES
  ('technology','Technology','Hardware, software, and the systems shaping modern life.',1),
  ('artificial-intelligence','Artificial Intelligence','Models, research, and the cultural impact of AI.',2),
  ('business','Business','Markets, strategy, and the companies defining the decade.',3),
  ('startups','Startups','Founders, funding, and the new economy.',4),
  ('finance','Finance','Capital markets, personal finance, and macro analysis.',5),
  ('design','Design','Product, graphic, and industrial design criticism.',6),
  ('architecture','Architecture','Buildings, urbanism, and the built environment.',7),
  ('lifestyle','Lifestyle','Modern living, taste, and the everyday.',8),
  ('food','Food','Restaurants, recipes, and food culture.',9),
  ('travel','Travel','Destinations, dispatches, and the art of the journey.',10),
  ('events','Events','Festivals, conferences, and cultural happenings.',11),
  ('music','Music','Albums, artists, and the sound of now.',12),
  ('cinema','Cinema','Film criticism, premieres, and the industry.',13),
  ('photography','Photography','Portfolios, photo essays, and the photographic eye.',14),
  ('gaming','Gaming','Games, platforms, and player culture.',15),
  ('esports','Esports','Competitive gaming, teams, and tournaments.',16),
  ('sports','Sports','Leagues, athletes, and the long story of play.',17),
  ('education','Education','Learning, schools, and the future of pedagogy.',18),
  ('science','Science','Discovery, experiment, and the natural world.',19),
  ('health','Health','Wellbeing, medicine, and the body.',20),
  ('marketing','Marketing','Brands, campaigns, and consumer attention.',21),
  ('culture','Culture','Ideas, identity, and the conversation of our time.',22),
  ('fashion','Fashion','Runway, street, and the business of style.',23),
  ('environment','Environment','Climate, ecology, and the planetary stakes.',24),
  ('innovation','Innovation','New methods, materials, and breakthroughs.',25),
  ('interviews','Interviews','Long conversations with the people who matter.',26),
  ('opinion','Opinion','Arguments, essays, and editorial perspective.',27),
  ('research','Research','Reports, white papers, and deep analysis.',28),
  ('guides','Guides','Practical, expert-led walkthroughs.',29)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

WITH templates(idx, title_suffix, excerpt, body_lead) AS (VALUES
  (1, 'The State of the Field in 2026', 'A wide-angle look at where the discipline stands today and the forces reshaping it.', 'For the past eighteen months, practitioners have been quietly rewriting the rules.'),
  (2, 'Five Voices Defining the Next Decade', 'Profiles of the figures whose work will set the agenda for years to come.', 'Influence is rarely loud. The people changing this field most often work in the margins.'),
  (3, 'A Field Guide to the New Vocabulary', 'The terms, frameworks, and ideas you need to follow the conversation.', 'Every era invents its own language. Here is the lexicon you cannot ignore.'),
  (4, 'What the Data Actually Says', 'A close reading of the most-cited studies of the year, with the caveats no one mentions.', 'Headlines simplify. The underlying research is far more interesting, and far more contested.')
),
authors(idx, name) AS (VALUES
  (0,'Eleanor Whitcombe'),(1,'Marcus Halberstam'),(2,'Priya Ramaswamy'),
  (3,'Theo Lindqvist'),(4,'Amara Okafor'),(5,'Jonas Reinholt'),
  (6,'Camille Beaumont'),(7,'Hiroshi Tanabe'),(8,'Sofia Marchetti'),
  (9,'Idris Ahmadi'),(10,'Wren Calloway'),(11,'Léa Fontaine')
),
cat_titles(slug, title_root) AS (VALUES
  ('technology','Quantum Hardware'),
  ('artificial-intelligence','Frontier Models'),
  ('business','Corporate Strategy'),
  ('startups','Seed-Stage Capital'),
  ('finance','Private Markets'),
  ('design','Editorial Typography'),
  ('architecture','Adaptive Reuse'),
  ('lifestyle','Slow Living'),
  ('food','Modern Bistros'),
  ('travel','Overland Journeys'),
  ('events','Independent Festivals'),
  ('music','Generative Composition'),
  ('cinema','Independent Cinema'),
  ('photography','Long-Form Photo Essays'),
  ('gaming','Single-Player Renaissance'),
  ('esports','League Restructuring'),
  ('sports','Performance Science'),
  ('education','Microcredentials'),
  ('science','Origin-of-Life Research'),
  ('health','Longevity Medicine'),
  ('marketing','Brand Worldbuilding'),
  ('culture','Internet Subcultures'),
  ('fashion','Quiet Luxury'),
  ('environment','Carbon Removal'),
  ('innovation','Materials Science'),
  ('interviews','In Conversation'),
  ('opinion','The Case Against'),
  ('research','Annual Index'),
  ('guides','Practitioner Notes')
)
INSERT INTO public.articles
  (slug, title, subtitle, excerpt, body, cover_image_url, category_id,
   author_name, read_time_minutes, featured, published, published_at)
SELECT
  c.slug || '-' || t.idx AS slug,
  c.title_root || ': ' || t.title_suffix AS title,
  NULL,
  t.excerpt,
  '## ' || c.title_root || E'\n\n' || t.body_lead || E'\n\n' ||
  'This piece is part of Provenance''s continuing coverage of ' || cat.name ||
  '. We spoke with practitioners, reviewed the recent literature, and visited the places where the work is actually being done.' || E'\n\n' ||
  '### What changed' || E'\n\nThree forces converged this year: a generational shift in leadership, the collapse of one dominant paradigm, and the unexpected return of an older idea. Each on its own would have been notable. Together they have reshaped the field.' || E'\n\n' ||
  '### Why it matters' || E'\n\nFor readers outside the discipline, the implication is simple: assumptions you held even a year ago are probably out of date. The institutions you trusted to summarise the field are themselves still catching up.' || E'\n\n' ||
  '### What to read next' || E'\n\nWe have linked the primary sources where possible. The conversation is moving quickly, and the best dispatches are still coming from the people doing the work.' AS body,
  'https://images.unsplash.com/photo-' ||
    (ARRAY[
      '1518770660439-4636190af475','1531297484001-80022131f5a1','1517248135467-4c7edcad34c4',
      '1486312338219-ce68d2c6f44d','1498050108023-c5249f4df085','1551434678-e076c223a692',
      '1504384308090-c894fdcc538d','1542435503-956c469947f6','1493612276216-ee3925520721',
      '1465101046530-73398c7f28ca','1506744038136-46273834b3fb','1519681393784-d120267933ba'
    ])[((abs(hashtext(c.slug || t.idx::text)) % 12) + 1)]
    || '?auto=format&fit=crop&w=1600&q=70' AS cover_image_url,
  cat.id,
  (SELECT name FROM authors WHERE idx = (abs(hashtext(c.slug || t.idx::text)) % 12)) AS author_name,
  4 + (abs(hashtext(c.slug || t.idx::text)) % 9) AS read_time_minutes,
  (t.idx = 1 AND c.slug IN ('artificial-intelligence','architecture','cinema','fashion','science')) AS featured,
  true,
  now() - ((abs(hashtext(c.slug || t.idx::text)) % 180) || ' days')::interval AS published_at
FROM cat_titles c
CROSS JOIN templates t
JOIN public.categories cat ON cat.slug = c.slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.ad_slots (slot_key, label, title, body, cta_text, cta_url, image_url, active)
SELECT * FROM (VALUES
  ('homepage_sidebar','Homepage Sidebar','Create a Perfect Editorial Site',
   'Provenance is built on a modern editorial stack. Explore the platform behind every story.',
   'Learn more','#',
   'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=70', true),
  ('homepage_banner','Homepage Banner','Sponsored: The Atelier Edition',
   'A limited capsule of editorial-grade objects from our partner studios. Shipping worldwide.',
   'Shop the edit','#', NULL, true),
  ('article_inline','In-Article Unit','Subscribe to the Provenance Weekly',
   'One long read, three short ones, and a curated set of links every Friday morning.',
   'Subscribe','#', NULL, true)
) AS v(slot_key,label,title,body,cta_text,cta_url,image_url,active)
WHERE NOT EXISTS (SELECT 1 FROM public.ad_slots a WHERE a.slot_key = v.slot_key);

DELETE FROM public.homepage_blocks;
INSERT INTO public.homepage_blocks (block_key, title, subtitle, block_type, category_slug, sort_order, enabled) VALUES
  ('hero','The Lead','Today''s defining story','hero',NULL,1,true),
  ('highlights','The Highlights','Hand-picked by the editors','grid',NULL,2,true),
  ('popular','Most Popular','What readers are spending time with','list',NULL,3,true),
  ('cinema_spotlight','Cinema','From the screen','category','cinema',4,true),
  ('ai_spotlight','Artificial Intelligence','Reporting on the frontier','category','artificial-intelligence',5,true),
  ('architecture_spotlight','Architecture','Building the next century','category','architecture',6,true),
  ('latest','Latest','Fresh from the desk','list',NULL,7,true);
