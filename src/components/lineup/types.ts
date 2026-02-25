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

// Standard hockey positions on the pitch (landscape: attack = right, defense = left)
export const PITCH_POSITIONS: PitchPosition[] = [
  // Attack line (right side of landscape pitch)
  { id: "lw", label: "LW", x: 85, y: 20, zone: "attack" },
  { id: "cf", label: "CF", x: 88, y: 50, zone: "attack" },
  { id: "rw", label: "RW", x: 85, y: 80, zone: "attack" },
  
  // Midfield line (center area)
  { id: "li", label: "LI", x: 65, y: 25, zone: "midfield" },
  { id: "ch", label: "CH", x: 68, y: 50, zone: "midfield" },
  { id: "ri", label: "RI", x: 65, y: 75, zone: "midfield" },
  
  // Defense line (left-center area)
  { id: "lh", label: "LH", x: 42, y: 25, zone: "defense" },
  { id: "fb", label: "FB", x: 38, y: 50, zone: "defense" },
  { id: "rh", label: "RH", x: 42, y: 75, zone: "defense" },
  
  // Goalkeeper (far left)
  { id: "gk", label: "GK", x: 15, y: 50, zone: "goalkeeper" },
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
