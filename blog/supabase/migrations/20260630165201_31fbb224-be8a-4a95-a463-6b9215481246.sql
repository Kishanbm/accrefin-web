
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE is_first BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO is_first;
  IF is_first THEN INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user'); END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, subtitle TEXT, excerpt TEXT,
  body TEXT NOT NULL DEFAULT '', cover_image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT, read_time_minutes INT NOT NULL DEFAULT 5,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles public" ON public.articles FOR SELECT
  USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage articles" ON public.articles FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER articles_updated BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);

CREATE TABLE public.ad_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key TEXT NOT NULL UNIQUE, label TEXT NOT NULL,
  title TEXT, body TEXT, image_url TEXT, cta_text TEXT, cta_url TEXT, custom_html TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ad_slots TO anon, authenticated;
GRANT ALL ON public.ad_slots TO service_role;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active ads public" ON public.ad_slots FOR SELECT
  USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage ads" ON public.ad_slots FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER ad_slots_updated BEFORE UPDATE ON public.ad_slots
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.homepage_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key TEXT NOT NULL UNIQUE, title TEXT NOT NULL, subtitle TEXT,
  block_type TEXT NOT NULL DEFAULT 'list', category_slug TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.homepage_blocks TO anon, authenticated;
GRANT ALL ON public.homepage_blocks TO service_role;
ALTER TABLE public.homepage_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage blocks public" ON public.homepage_blocks FOR SELECT
  USING (enabled = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage homepage blocks" ON public.homepage_blocks FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER homepage_blocks_updated BEFORE UPDATE ON public.homepage_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.categories (slug, name, description, sort_order) VALUES
  ('culture','Culture','Stories about how we live, see, and feel.',1),
  ('technology','Technology','The systems and tools shaping our world.',2),
  ('architecture','Architecture','Built spaces, considered.',3),
  ('design','Design','Form, function, and the in-between.',4),
  ('music','Music','Sound, the people who shape it, and the rooms it lives in.',5),
  ('cinema','Cinema','Film, television, and the moving image.',6),
  ('business','Business','Companies, markets, and the people who build them.',7),
  ('lifestyle','Lifestyle','Considered living, slowly.',8);

INSERT INTO public.articles (slug, title, subtitle, excerpt, body, cover_image_url, category_id, author_name, read_time_minutes, featured)
SELECT 'silent-language-brutalist-london',
  'The Silent Language of Brutalist Structures in 1970s London',
  'How concrete became a moral argument.',
  'A walk through the Barbican, Trellick Tower, and the Hayward — and a reconsideration of what raw material asks of us.',
  E'## A material with intent\n\nBrutalism was never about ugliness. It was about honesty — the refusal to dress concrete up as anything other than what it was: poured, finite, structural.\n\nIn London in the 1970s, this argument took the shape of housing estates, cultural centers, and walkways stitched between them.\n\n> "The purpose of architecture is not to imitate, but to reveal." — Ernő Goldfinger\n\n## The afterlife\n\nDecades later, the same buildings that were dismissed as inhuman are protected, photographed, and lived in.',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&q=80',
  c.id, 'Helena Vance', 12, true
FROM public.categories c WHERE c.slug = 'architecture';

INSERT INTO public.articles (slug, title, subtitle, excerpt, body, cover_image_url, category_id, author_name, read_time_minutes, featured) VALUES
  ('typeface-future-past','Why the Typeface of the Future Looks Exactly Like the Past','Notes on a quiet revival.','The most-downloaded fonts of 2025 share a strange family resemblance with the metal type of the 1920s.',E'## The return\n\nFor a decade, the default look of the internet has been geometric sans. Then, quietly, the brief shifted.','https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='design'),'Julian Mercer',7,false),
  ('berlin-metro-acoustics','Inside the Hidden Acoustics of the Berlin Metro System','A field recordist''s love letter.','The U-Bahn was designed to be heard.',E'## The orchestra below\n\nEvery station has a tonal signature.','https://images.unsplash.com/photo-1474968600345-0e840bb1c5cb?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='music'),'Markus Ehlert',9,false),
  ('independent-bookstore-renaissance','The Renaissance of the Independent Bookstore','Why physical shelves are winning again.','Digital fatigue is driving a new generation back to tactile, curated reading.',E'## Slow shelves\n\nThe independent bookstore is a quiet protest against the algorithm.','https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='culture'),'Anya Hollander',8,false),
  ('kyoto-secret-gardens','Kyoto''s Secret Gardens of the Modern Era','A photographic journey.','Through the private courtyard landscapes of contemporary Japan.',E'## Tsuboniwa\n\nThe pocket gardens of Kyoto are smaller than a parking space and contain more attention than most buildings.','https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='culture'),'Rin Tanaka',11,false),
  ('smaller-louder-world','Why the World is Becoming Smaller and Louder at Once','The paradox of connectivity.','The paradoxical nature of global connectivity and the rise of acoustic ecology.',E'## Acoustic ecology\n\nA growing field argues that we have an obligation to the soundscapes we leave behind.','https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='technology'),'Sofia Lindgren',10,false),
  ('objects-pure-utility','Objects of Pure Utility','A short essay on the chair, the bowl, and the lamp.','When function is the only argument an object makes, it tends to last longer than the styles around it.',E'## The shape of need\n\nA chair has one job.','https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='lifestyle'),'Theo Karras',5,false),
  ('nocturnal-narratives','Nocturnal Narratives','How cinema learned to love the dark.','A close read of three films that treat the night not as an absence of light, but as a presence of its own.',E'## After hours\n\nNight in film is rarely just night. It is mood, threat, and permission.','https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='cinema'),'Camille Boucher',9,false),
  ('synthesis-analog-souls','Synthesis of Analog Souls','The studios refusing to go fully digital.','Inside a generation of producers who treat tape hiss as a feature, not a bug.',E'## Tape, still\n\nThere are studios in Berlin, Lisbon, and Memphis that have never owned a Pro Tools license.','https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='music'),'Wren Adesina',8,false),
  ('sound-isnt-digital','The Future of Sound Isn''t Digital — It''s Sensory','Music that reacts to the body.','Artists merging traditional instrumentation with biometric feedback.',E'## Reactive composition\n\nThe next decade of music is being written by composers who think of the listener as half of the instrument.','https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&q=80',(SELECT id FROM public.categories WHERE slug='music'),'Idris Kahn',14,true);

INSERT INTO public.ad_slots (slot_key, label, title, body, cta_text, cta_url, image_url) VALUES
  ('home_sidebar','Homepage Sidebar','Timelessness is a choice.','Discover the Archive Collection from Horology Labs. Precision engineered for the modern nomad.','Explore Collection','#','https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'),
  ('home_banner','Homepage Banner','The Sunday Edition','A weekly digest of the long reads worth your time.','Subscribe','#',null),
  ('article_inline','Article Inline','A quieter way to read.','Sponsored by Vellum — paper goods for considered people.','Visit Vellum','#','https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80');

INSERT INTO public.homepage_blocks (block_key, title, subtitle, block_type, sort_order) VALUES
  ('hero','Cover Story',null,'hero',1),
  ('highlights','The Highlights','Selected reading from the week.','carousel',2),
  ('most_popular','Most Popular',null,'bento',3),
  ('category_feature','Category Spotlight',null,'feature',4),
  ('latest','Latest','Fresh from the desk.','grid',5);
