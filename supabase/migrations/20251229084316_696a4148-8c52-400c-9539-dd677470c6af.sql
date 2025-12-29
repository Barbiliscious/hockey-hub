-- Fix RLS policies for associations, clubs, and teams
-- Drop the existing RESTRICTIVE policies and recreate as PERMISSIVE

-- Fix associations table
DROP POLICY IF EXISTS "Anyone can view associations" ON public.associations;
CREATE POLICY "Anyone can view associations"
ON public.associations
FOR SELECT
TO public
USING (true);

-- Fix clubs table  
DROP POLICY IF EXISTS "Anyone can view clubs" ON public.clubs;
CREATE POLICY "Anyone can view clubs"
ON public.clubs
FOR SELECT
TO public
USING (true);

-- Fix teams table
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;
CREATE POLICY "Anyone can view teams"
ON public.teams
FOR SELECT
TO public
USING (true);

-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;