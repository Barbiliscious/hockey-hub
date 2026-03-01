import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTeamDisplayName(team: { division?: string | null; gender?: string | null; name: string }) {
  if (team.division && team.gender) return `${team.division} ${team.gender}`;
  return team.name;
}
