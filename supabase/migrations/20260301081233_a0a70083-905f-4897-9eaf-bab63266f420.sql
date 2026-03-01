
-- Add scope columns to user_roles for hierarchical admin visibility
ALTER TABLE public.user_roles
  ADD COLUMN association_id uuid REFERENCES public.associations(id) ON DELETE CASCADE,
  ADD COLUMN club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
  ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX idx_user_roles_association_id ON public.user_roles(association_id);
CREATE INDEX idx_user_roles_club_id ON public.user_roles(club_id);
CREATE INDEX idx_user_roles_team_id ON public.user_roles(team_id);
