
-- Add branding columns to clubs table
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS home_ground text;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS primary_colour text;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS secondary_colour text;
