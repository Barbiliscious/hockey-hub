// Mock data for the application
// This will be replaced with Supabase data when backend is connected

export const mockAssociations = [
  {
    id: "1",
    name: "Ballarat Hockey Association",
    themePrimaryColor: "#1e3a5f",
    themeSecondaryColor: "#14b8a6",
  },
  {
    id: "2",
    name: "Geelong Hockey Association",
    themePrimaryColor: "#2d5a27",
    themeSecondaryColor: "#f59e0b",
  },
  {
    id: "3",
    name: "Bendigo Hockey Association",
    themePrimaryColor: "#7c2d12",
    themeSecondaryColor: "#fbbf24",
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
  {
    id: "2",
    associationId: "1",
    name: "Ballarat Tigers HC",
    themePrimaryColor: "#f97316",
    themeSecondaryColor: "#000000",
  },
  {
    id: "3",
    associationId: "1",
    name: "Wendouree FC Hockey",
    themePrimaryColor: "#dc2626",
    themeSecondaryColor: "#ffffff",
  },
  {
    id: "4",
    associationId: "2",
    name: "Geelong Saints HC",
    themePrimaryColor: "#1d4ed8",
    themeSecondaryColor: "#ffffff",
  },
  {
    id: "5",
    associationId: "3",
    name: "Bendigo Thunder",
    themePrimaryColor: "#7c2d12",
    themeSecondaryColor: "#fbbf24",
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
  {
    id: "4",
    clubId: "1",
    name: "Div1 Men",
    grade: "Division 1",
  },
  {
    id: "5",
    clubId: "1",
    name: "Div3 Women",
    grade: "Division 3",
  },
  {
    id: "6",
    clubId: "2",
    name: "Tigers Div1 Men",
    grade: "Division 1",
  },
  {
    id: "7",
    clubId: "2",
    name: "Tigers Div2 Women",
    grade: "Division 2",
  },
  {
    id: "8",
    clubId: "3",
    name: "Wendouree Premier",
    grade: "Premier League",
  },
];

export const mockPlayers = [
  { id: "1", name: "James Wilson", position: "Centre Forward", number: 7 },
  { id: "2", name: "Sarah Chen", position: "Goalkeeper", number: 1 },
  { id: "3", name: "Marcus Lee", position: "Left Wing", number: 11 },
  { id: "4", name: "Emily Brown", position: "Centre Half", number: 6 },
  { id: "5", name: "David Singh", position: "Right Half", number: 4 },
  { id: "6", name: "Olivia Taylor", position: "Fullback", number: 3 },
  { id: "7", name: "Michael O'Brien", position: "Right Wing", number: 9 },
  { id: "8", name: "Jessica Nguyen", position: "Left Inside", number: 8 },
  { id: "9", name: "Daniel Kim", position: "Right Inside", number: 10 },
  { id: "10", name: "Sophie Martinez", position: "Left Half", number: 5 },
  { id: "11", name: "Ryan Thompson", position: "Centre Forward", number: 12 },
  { id: "12", name: "Emma Watson", position: "Goalkeeper", number: 22 },
  { id: "13", name: "Liam Johnson", position: "Fullback", number: 2 },
  { id: "14", name: "Ava Williams", position: "Centre Half", number: 14 },
  { id: "15", name: "Noah Davis", position: "Left Wing", number: 17 },
  { id: "16", name: "Isabella Garcia", position: "Right Wing", number: 19 },
  { id: "17", name: "Ethan Miller", position: "Left Inside", number: 15 },
  { id: "18", name: "Mia Anderson", position: "Right Inside", number: 16 },
  { id: "19", name: "Lucas White", position: "Left Half", number: 18 },
  { id: "20", name: "Charlotte Harris", position: "Right Half", number: 20 },
  { id: "21", name: "Benjamin Clark", position: "Centre Forward", number: 21 },
  { id: "22", name: "Amelia Lewis", position: "Fullback", number: 23 },
  { id: "23", name: "Mason Walker", position: "Centre Half", number: 24 },
  { id: "24", name: "Harper Robinson", position: "Left Wing", number: 25 },
];

// Current user profile
export const currentUser = {
  id: "1",
  name: "James Wilson",
  primaryTeam: "Grampians HC",
  otherTeams: ["Grampians HC Women"],
  primaryPosition: "Centre Forward",
  otherPositions: ["Left Inside", "Right Inside"],
};

// Demo lineup data - games where user is selected by coach
export const mockLineups: Record<string, { playerId: string; position: string }[]> = {
  "1": [{ playerId: "1", position: "Centre Forward" }],
  "4": [{ playerId: "1", position: "Left Wing" }],
};

// User's availability per game (initially only some set)
export const mockUserAvailability: Record<string, AvailabilityStatus> = {
  "1": "AVAILABLE",
  "2": "UNSURE",
};

export const mockGames = [
  {
    id: "1",
    teamId: "1",
    homeTeamName: "Grampians HC",
    awayTeamName: "Ballarat Tigers",
    associationName: "Ballarat HA",
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
    associationName: "Ballarat HA",
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
    associationName: "Ballarat HA",
    grade: "Division 2",
    date: "2024-12-28",
    startTime: "12:00",
    location: "Tiger Arena",
    status: "SCHEDULED",
    isClubTeamGame: false,
  },
  {
    id: "4",
    teamId: "2",
    homeTeamName: "Grampians HC Women",
    awayTeamName: "Wendouree Ladies",
    associationName: "Ballarat HA",
    grade: "Division 1",
    date: "2024-12-29",
    startTime: "10:00",
    location: "Prince of Wales Park",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "5",
    teamId: "1",
    homeTeamName: "Grampians HC",
    awayTeamName: "Sebastopol United",
    associationName: "Ballarat HA",
    grade: "Division 2",
    date: "2025-01-11",
    startTime: "15:00",
    location: "Prince of Wales Park",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "6",
    teamId: null,
    homeTeamName: "Geelong Saints",
    awayTeamName: "Ballarat Tigers",
    associationName: "Geelong HA",
    grade: "Premier League",
    date: "2025-01-05",
    startTime: "18:00",
    location: "Kardinia Park",
    status: "SCHEDULED",
    isClubTeamGame: false,
  },
  {
    id: "7",
    teamId: "3",
    homeTeamName: "Grampians U17",
    awayTeamName: "Tigers U17",
    associationName: "Ballarat HA",
    grade: "Under 17",
    date: "2024-12-30",
    startTime: "09:00",
    location: "Prince of Wales Park",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "8",
    teamId: null,
    homeTeamName: "Bendigo Thunder",
    awayTeamName: "Geelong Saints",
    associationName: "Bendigo HA",
    grade: "Division 1",
    date: "2025-01-12",
    startTime: "14:00",
    location: "Bendigo Stadium",
    status: "SCHEDULED",
    isClubTeamGame: false,
  },
  {
    id: "9",
    teamId: "4",
    homeTeamName: "Grampians HC Div1",
    awayTeamName: "Wendouree Premier",
    associationName: "Ballarat HA",
    grade: "Division 1",
    date: "2025-01-18",
    startTime: "16:30",
    location: "Prince of Wales Park",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "10",
    teamId: null,
    homeTeamName: "Sebastopol United",
    awayTeamName: "Ballarat Tigers",
    associationName: "Ballarat HA",
    grade: "Division 2",
    date: "2025-01-19",
    startTime: "11:00",
    location: "Sebastopol Recreation Reserve",
    status: "SCHEDULED",
    isClubTeamGame: false,
  },
  {
    id: "11",
    teamId: "2",
    homeTeamName: "Tigers Ladies",
    awayTeamName: "Grampians HC Women",
    associationName: "Ballarat HA",
    grade: "Division 1",
    date: "2025-01-25",
    startTime: "13:00",
    location: "Tiger Arena",
    status: "SCHEDULED",
    isClubTeamGame: true,
  },
  {
    id: "12",
    teamId: null,
    homeTeamName: "Wendouree FC",
    awayTeamName: "Sebastopol United",
    associationName: "Ballarat HA",
    grade: "Division 3",
    date: "2025-01-26",
    startTime: "10:30",
    location: "Wendouree Sports Complex",
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
