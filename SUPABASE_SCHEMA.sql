-- ==============================================================================
-- 🚀 SKYPRO EXCHANGE - SUPABASE SETTINGS TABLE & REALTIME SCHEMA
-- ==============================================================================
-- Run this SQL in your Supabase Dashboard -> SQL Editor -> Click "RUN"

-- 1. Create the site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    whatsapp_number TEXT NOT NULL DEFAULT '123456789',
    whatsapp_url TEXT NOT NULL DEFAULT 'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0',
    instagram_name TEXT NOT NULL DEFAULT 'lionexch99',
    instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/lionexch99',
    footer_domain TEXT NOT NULL DEFAULT 'www.skyexchangepro.com',
    support_number_1 TEXT DEFAULT '+351926917651',
    support_number_2 TEXT DEFAULT '+351926917279',
    banner_1_url TEXT DEFAULT '/banner.jpeg',
    banner_2_url TEXT DEFAULT '/images.jpeg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If table already exists, add banner columns safely:
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS banner_1_url TEXT DEFAULT '/banner.jpeg';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS banner_2_url TEXT DEFAULT '/images.jpeg';

-- 2. Insert the initial default settings row (if not exists)
INSERT INTO public.site_settings (
    id,
    whatsapp_number,
    whatsapp_url,
    instagram_name,
    instagram_url,
    footer_domain,
    support_number_1,
    support_number_2,
    banner_1_url,
    banner_2_url
)
VALUES (
    'config',
    '123456789',
    'https://api.whatsapp.com/send/?phone=123456789&text&type=phone_number&app_absent=0',
    'lionexch99',
    'https://www.instagram.com/lionexch99',
    'www.skyexchangepro.com',
    '+351926917651',
    '+351926917279',
    '/banner.jpeg',
    '/images.jpeg'
)
ON CONFLICT (id) DO UPDATE SET
    banner_1_url = EXCLUDED.banner_1_url,
    banner_2_url = EXCLUDED.banner_2_url;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies: Allow everyone (Public / Anon) to Read and Update the configuration
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Public Update Settings" ON public.site_settings;
CREATE POLICY "Public Update Settings"
ON public.site_settings
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. Enable Realtime Publications (Optional for Instant Sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
