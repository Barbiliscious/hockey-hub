// Types for the lineup feature

export interface PitchPosition {
  id: string;
  label: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  zone: "attack" | "midfield" | "defense" | "goalkeeper";
}

export interface SelectedPlayer {
  id: string;
  name: string;
  number: number;
  positionId: string | null;
  isStarter: boolean;
  preferredPosition?: string;
}

export interface DragItem {
  playerId: string;
  sourcePositionId: string | null;
}

// Standard hockey positions on the pitch
export const PITCH_POSITIONS: PitchPosition[] = [
  // Attack line (top of pitch view)
  { id: "lw", label: "LW", x: 20, y: 15, zone: "attack" },
  { id: "cf", label: "CF", x: 50, y: 12, zone: "attack" },
  { id: "rw", label: "RW", x: 80, y: 15, zone: "attack" },
  
  // Midfield line
  { id: "li", label: "LI", x: 25, y: 35, zone: "midfield" },
  { id: "ch", label: "CH", x: 50, y: 32, zone: "midfield" },
  { id: "ri", label: "RI", x: 75, y: 35, zone: "midfield" },
  
  // Defense line
  { id: "lh", label: "LH", x: 25, y: 58, zone: "defense" },
  { id: "fb", label: "FB", x: 50, y: 62, zone: "defense" },
  { id: "rh", label: "RH", x: 75, y: 58, zone: "defense" },
  
  // Goalkeeper
  { id: "gk", label: "GK", x: 50, y: 85, zone: "goalkeeper" },
];

export const POSITION_LABELS: Record<string, string> = {
  lw: "Left Wing",
  cf: "Centre Forward",
  rw: "Right Wing",
  li: "Left Inside",
  ch: "Centre Half",
  ri: "Right Inside",
  lh: "Left Half",
  fb: "Fullback",
  rh: "Right Half",
  gk: "Goalkeeper",
};
