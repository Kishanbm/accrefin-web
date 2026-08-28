-- Add new columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Create banners table (use gen_random_uuid — available by default on Supabase)
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Banners policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Banners are viewable by everyone" ON banners;
CREATE POLICY "Banners are viewable by everyone" ON banners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can insert banners" ON banners;
CREATE POLICY "Admins can insert banners" ON banners FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can update banners" ON banners;
CREATE POLICY "Admins can update banners" ON banners FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admins can delete banners" ON banners;
CREATE POLICY "Admins can delete banners" ON banners FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create site_settings table (key is PK — matches app upsert onConflict: key)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- Site settings policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
CREATE POLICY "Admins can update site settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
