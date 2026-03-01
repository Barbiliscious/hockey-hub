import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
export type AppMode = "super_admin" | "association" | "club" | "team" | "player";

const ROLE_TO_MODE: Record<AppRole, AppMode> = {
  SUPER_ADMIN: "super_admin",
  ASSOCIATION_ADMIN: "association",
  CLUB_ADMIN: "club",
  TEAM_MANAGER: "team",
  COACH: "team",
  PLAYER: "player",
};

// Mode hierarchy from highest to lowest
const MODE_HIERARCHY: AppMode[] = ["super_admin", "association", "club", "team", "player"];

const MODE_LABELS: Record<AppMode, string> = {
  super_admin: "Super Admin",
  association: "Association",
  club: "Club",
  team: "Team",
  player: "Player",
};

const MODE_LANDING: Record<AppMode, string> = {
  super_admin: "/admin",
  association: "/admin",
  club: "/admin",
  team: "/dashboard",
  player: "/dashboard",
};

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  availableModes: AppMode[];
  canSwitchMode: boolean;
  modeLabel: string;
  modeLanding: string;
  loading: boolean;
  roles: AppRole[];
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

const STORAGE_KEY = "app_mode";

export function AppModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [availableModes, setAvailableModes] = useState<AppMode[]>([]);
  const [mode, setModeState] = useState<AppMode>("player");
  const [loading, setLoading] = useState(true);

  // Fetch roles
  useEffect(() => {
    if (!user) {
      setRoles([]);
      setAvailableModes([]);
      setModeState("player");
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const userRoles = (data?.map((r) => r.role) || []) as AppRole[];
      setRoles(userRoles);

      // Derive available modes (deduplicated, ordered by hierarchy)
      const modesSet = new Set<AppMode>();
      userRoles.forEach((role) => {
        modesSet.add(ROLE_TO_MODE[role]);
      });
      // Always include player mode
      modesSet.add("player");
      
      const ordered = MODE_HIERARCHY.filter((m) => modesSet.has(m));
      setAvailableModes(ordered);

      // Restore persisted mode or default to highest
      const stored = localStorage.getItem(STORAGE_KEY) as AppMode | null;
      if (stored && ordered.includes(stored)) {
        setModeState(stored);
      } else if (ordered.length > 0) {
        setModeState(ordered[0]);
      }

      setLoading(false);
    };

    fetchRoles();
  }, [user?.id]);

  const setMode = useCallback((newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  return (
    <AppModeContext.Provider
      value={{
        mode,
        setMode,
        availableModes,
        canSwitchMode: availableModes.length > 1,
        modeLabel: MODE_LABELS[mode],
        modeLanding: MODE_LANDING[mode],
        loading,
        roles,
      }}
    >
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error("useAppMode must be used within AppModeProvider");
  }
  return context;
}

export { MODE_LABELS, MODE_LANDING };
