import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { mockGames, currentUser, mockLineups, mockUserAvailability, type AvailabilityStatus } from "@/lib/mockData";

const Dashboard = () => {
  const [gameFilter, setGameFilter] = useState<string>("all");
  const [userAvailability, setUserAvailability] = useState<Record<string, AvailabilityStatus>>(mockUserAvailability);
  
  const upcomingGames = mockGames
    .filter((game) => game.status === "SCHEDULED")
    .slice(0, 5);

  const myTeamGames = upcomingGames.filter((game) => game.isClubTeamGame);
  
  const filteredGames = gameFilter === "all" 
    ? upcomingGames 
    : gameFilter === "club" 
    ? upcomingGames.filter((game) => game.isClubTeamGame)
    : upcomingGames.filter((game) => !game.isClubTeamGame);

  // Check if user is selected for lineup
  const getUserLineupPosition = (gameId: string): string | null => {
    const lineup = mockLineups[gameId];
    if (!lineup) return null;
    const userInLineup = lineup.find(p => p.playerId === currentUser.id);
    return userInLineup?.position || null;
  };

  // Check if team name matches user's primary team
  const isPrimaryTeam = (teamName: string): boolean => {
    return teamName.includes("Grampians");
  };

  // Handle availability selection
  const handleAvailabilityChange = (gameId: string, status: AvailabilityStatus) => {
    setUserAvailability(prev => ({ ...prev, [gameId]: status }));
  };

  // Generate calendar data for 42 cells (6 weeks)
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday, adjust to Monday = 0)
    let startOffset = firstDayOfMonth.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    
    const daysInMonth = lastDayOfMonth.getDate();
    const days: { date: number; isCurrentMonth: boolean; isToday: boolean; hasGame: boolean }[] = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        hasGame: false,
      });
    }
    
    // Current month days
    const gameDays = mockGames
      .filter(g => {
        const gameDate = new Date(g.date);
        return gameDate.getMonth() === month && gameDate.getFullYear() === year;
      })
      .map(g => new Date(g.date).getDate());
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: i === today.getDate(),
        hasGame: gameDays.includes(i),
      });
    }
    
    // Next month days to fill 42 cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        hasGame: false,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="py-4 px-6">
          <p className="text-lg font-medium">
            Dashboard home team. Welcome {currentUser.name.split(" ")[0]}
          </p>
        </CardContent>
      </Card>

      {/* Main 2-column Grid - 70/30 ratio */}
      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Club Banner - matches calendar height */}
          <Card className="bg-primary text-primary-foreground h-[260px]">
            <CardContent className="flex items-center justify-center h-full py-8">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Grampians Hockey Club</h2>
                <p className="text-primary-foreground/80">Club banner</p>
              </div>
            </CardContent>
          </Card>

          {/* All Upcoming Games */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-primary-foreground">
                  All upcoming games
                </CardTitle>
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="w-[120px] h-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-xs">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All games</SelectItem>
                    <SelectItem value="club">Club games</SelectItem>
                    <SelectItem value="other">Other games</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredGames.length === 0 ? (
                <p className="text-primary-foreground/70 text-sm">No upcoming games</p>
              ) : (
                filteredGames.slice(0, 4).map((game) => {
                  const lineupPosition = getUserLineupPosition(game.id);
                  const availability = userAvailability[game.id];
                  const showAvailability = game.isClubTeamGame && !lineupPosition;
                  const showPosition = !!lineupPosition;

                  return (
                    <Link
                      key={game.id}
                      to={`/games/${game.id}`}
                      className="block p-3 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    >
                      {/* Line 1: Teams, Association, Grade */}
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm">
                          <span className={isPrimaryTeam(game.homeTeamName) ? "font-bold" : ""}>
                            {game.homeTeamName}
                          </span>
                          {" vs "}
                          <span className={isPrimaryTeam(game.awayTeamName) ? "font-bold" : ""}>
                            {game.awayTeamName}
                          </span>
                          <span className="text-primary-foreground/70">
                            {" "}({game.associationName}) ({game.grade})
                          </span>
                        </p>
                        <ChevronRight className="h-4 w-4 text-primary-foreground/50 flex-shrink-0" />
                      </div>

                      {/* Line 2: Date, Time, Location */}
                      <div className="flex items-center gap-3 text-xs text-primary-foreground/70 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(game.date).toLocaleDateString("en-AU", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {game.startTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {game.location}
                        </span>
                      </div>

                      {/* Line 3: Conditional - Availability or Position */}
                      {showPosition ? (
                        <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                          {lineupPosition}
                        </Badge>
                      ) : showAvailability ? (
                        <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                          <Badge
                            onClick={() => handleAvailabilityChange(game.id, "AVAILABLE")}
                            className={`text-xs cursor-pointer transition-all ${
                              availability === "AVAILABLE"
                                ? "bg-green-500 text-white border-0"
                                : "bg-green-500/20 text-green-200 border-0 hover:bg-green-500/40"
                            }`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                          <Badge
                            onClick={() => handleAvailabilityChange(game.id, "UNAVAILABLE")}
                            className={`text-xs cursor-pointer transition-all ${
                              availability === "UNAVAILABLE"
                                ? "bg-red-500 text-white border-0"
                                : "bg-red-500/20 text-red-200 border-0 hover:bg-red-500/40"
                            }`}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Not Available
                          </Badge>
                          <Badge
                            onClick={() => handleAvailabilityChange(game.id, "UNSURE")}
                            className={`text-xs cursor-pointer transition-all ${
                              availability === "UNSURE"
                                ? "bg-yellow-500 text-white border-0"
                                : "bg-yellow-500/20 text-yellow-200 border-0 hover:bg-yellow-500/40"
                            }`}
                          >
                            <HelpCircle className="h-3 w-3 mr-1" />
                            Unsure
                          </Badge>
                        </div>
                      ) : null}
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Calendar */}
          <Card className="bg-primary text-primary-foreground h-[260px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-primary-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 6-week calendar view */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="py-0.5 text-primary-foreground/70 font-medium">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, i) => (
                  <div
                    key={i}
                    className={`py-1 rounded-full text-xs ${
                      day.isToday
                        ? "bg-primary-foreground text-primary font-bold"
                        : day.hasGame && day.isCurrentMonth
                        ? "bg-primary-foreground/20 text-primary-foreground font-medium"
                        : day.isCurrentMonth
                        ? "text-primary-foreground font-medium"
                        : "text-primary-foreground/40"
                    }`}
                  >
                    {day.date}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Team Games */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-primary-foreground">
                Upcoming games for your team/s approved for
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {myTeamGames.length === 0 ? (
                <p className="text-primary-foreground/70 text-sm">No team games scheduled</p>
              ) : (
                myTeamGames.slice(0, 4).map((game) => (
                  <Link
                    key={game.id}
                    to={`/games/${game.id}`}
                    className="block p-3 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {game.homeTeamName} vs {game.awayTeamName}
                      </p>
                      <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs">
                        {game.grade}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-primary-foreground/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(game.date).toLocaleDateString("en-AU", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {game.startTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {game.location}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;