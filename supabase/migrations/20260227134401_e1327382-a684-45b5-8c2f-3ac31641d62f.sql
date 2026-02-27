
-- ============================================
-- 1. GAME AVAILABILITY
-- ============================================
CREATE TABLE public.game_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('AVAILABLE', 'UNAVAILABLE', 'UNSURE', 'PENDING')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id)
);

ALTER TABLE public.game_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view availability for their team games"
  ON public.game_availability FOR SELECT
  USING (
    user_id = auth.uid()
    OR game_id IN (
      SELECT g.id FROM games g
      JOIN team_memberships tm ON tm.team_id = g.team_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'APPROVED'
    )
    OR has_role(auth.uid(), 'SUPER_ADMIN')
    OR has_role(auth.uid(), 'COACH')
    OR has_role(auth.uid(), 'CLUB_ADMIN')
  );

CREATE POLICY "Users can set their own availability"
  ON public.game_availability FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own availability"
  ON public.game_availability FOR UPDATE
  USING (user_id = auth.uid());

CREATE TRIGGER update_game_availability_updated_at
  BEFORE UPDATE ON public.game_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. TEAM MESSAGES (Chat)
-- ============================================
CREATE TABLE public.team_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view messages"
  ON public.team_messages FOR SELECT
  USING (
    team_id IN (
      SELECT tm.team_id FROM team_memberships tm
      WHERE tm.user_id = auth.uid() AND tm.status = 'APPROVED'
    )
    OR has_role(auth.uid(), 'SUPER_ADMIN')
    OR has_role(auth.uid(), 'COACH')
    OR has_role(auth.uid(), 'CLUB_ADMIN')
  );

CREATE POLICY "Team members can send messages"
  ON public.team_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (
      team_id IN (
        SELECT tm.team_id FROM team_memberships tm
        WHERE tm.user_id = auth.uid() AND tm.status = 'APPROVED'
      )
      OR has_role(auth.uid(), 'SUPER_ADMIN')
      OR has_role(auth.uid(), 'COACH')
      OR has_role(auth.uid(), 'CLUB_ADMIN')
    )
  );

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_messages;

-- ============================================
-- 3. NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  game_id uuid REFERENCES public.games(id) ON DELETE CASCADE,
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "System and admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR has_role(auth.uid(), 'SUPER_ADMIN')
    OR has_role(auth.uid(), 'COACH')
    OR has_role(auth.uid(), 'CLUB_ADMIN')
    OR has_role(auth.uid(), 'TEAM_MANAGER')
  );
