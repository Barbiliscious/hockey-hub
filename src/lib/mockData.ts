// Mock data for the application
// This will be replaced with Supabase data when backend is connected

export const mockAssociations = [
  {
    id: "1",
    name: "Ballarat Hockey Association",
    themePrimaryColor: "#1e3a5f",
    themeSecondaryColor: "#14b8a6",
  },
];

export const mockClubs = [
  {
    id: "1",
    associationId: "1",
    name: "Grampians Hockey Club",
    themePrimaryColor: "#1e3a5f",
    themeSecondaryColor: "#14b8a6",
  },
];

export const mockTeams = [
  {
    id: "1",
    clubId: "1",
    name: "Div2 Men",
    grade: "Division 2",
  },
  {
    id: "2",
    clubId: "1",
    name: "Div1 Women",
    grade: "Division 1",
  },
  {
    id: "3",
    clubId: "1",
    name: "U17 Mixed",
    grade: "Under 17",
  },
];

export const mockPlayers = [
  { id: "1", name: "James Wilson", position: "Centre Forward", number: 7 },
  { id: "2", name: "Sarah Chen", position: "Goalkeeper", number: 1 },
  { id: "3", name: "Marcus Lee", position: "Left Wing", number: 11 },
  { id: "4", name: "Emily Brown", position: "Centre Half", number: 6 },
  { id: "5", name: "David Singh", position: "Right Half", number: 4 },
  { id: "6", name: "Olivia Taylor", position: "Fullback", number: 3 },
];

export const mockGames = [
  {
    id: "1",
    teamId: "1",
    homeTeamName: "Grampians HC",
    awayTeamName: "Ballarat Tigers",
    grade: "Division 2",
    date: "2024-12-28",
    startTime: "14:30",
    location: "Prince of Wales Park",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "2",
    teamId: "1",
    homeTeamName: "Wendouree FC",
    awayTeamName: "Grampians HC",
    grade: "Division 2",
    date: "2025-01-04",
    startTime: "16:00",
    location: "Wendouree Sports Complex",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "3",
    teamId: null,
    homeTeamName: "Ballarat Tigers",
    awayTeamName: "Wendouree FC",
    grade: "Division 2",
    date: "2024-12-28",
    startTime: "12:00",
    location: "Tiger Arena",
    status: "SCHEDULED",
    isClubTeamGame: false,
  },
];

export const positions = [
  // Strikers
  "Left Wing",
  "Centre Forward",
  "Right Wing",
  // Mid-fielders
  "Left Inside",
  "Centre Half",
  "Right Inside",
  // Backs
  "Left Half",
  "Fullback",
  "Right Half",
  // Goalkeeper
  "Goalkeeper",
];

export type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE" | "UNSURE";
export type GameStatus = "SCHEDULED" | "FINALISED";
export type Role = "PLAYER" | "COACH" | "ADMIN";
export type MembershipStatus = "PENDING" | "APPROVED" | "REJECTED";
