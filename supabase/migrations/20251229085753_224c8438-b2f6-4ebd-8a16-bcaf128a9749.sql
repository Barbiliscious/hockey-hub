-- Create primary_change_requests table to track player-initiated primary team change requests
CREATE TABLE public.primary_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  from_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  to_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'PENDING',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED'))
);

-- Enable RLS
ALTER TABLE public.primary_change_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own primary change requests"
ON public.primary_change_requests
FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own requests
CREATE POLICY "Users can create their own primary change requests"
ON public.primary_change_requests
FOR INSERT
WITH CHECK (user_id = auth.uid() AND status = 'PENDING');

-- Users can cancel their own pending requests
CREATE POLICY "Users can cancel their own pending requests"
ON public.primary_change_requests
FOR UPDATE
USING (user_id = auth.uid() AND status = 'PENDING')
WITH CHECK (status = 'CANCELLED');

-- Admins and coaches can manage all requests
CREATE POLICY "Admins and coaches can manage primary change requests"
ON public.primary_change_requests
FOR ALL
USING (
  has_role(auth.uid(), 'CLUB_ADMIN'::app_role) OR 
  has_role(auth.uid(), 'ASSOCIATION_ADMIN'::app_role) OR 
  has_role(auth.uid(), 'COACH'::app_role) OR
  has_role(auth.uid(), 'TEAM_MANAGER'::app_role)
);

-- Add updated_at trigger
CREATE TRIGGER update_primary_change_requests_updated_at
BEFORE UPDATE ON public.primary_change_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add invited_by column to team_memberships to track who initiated the membership
ALTER TABLE public.team_memberships 
ADD COLUMN invited_by UUID;