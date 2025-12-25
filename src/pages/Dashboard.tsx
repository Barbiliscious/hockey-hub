import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { mockGames } from "@/lib/mockData";

const Dashboard = () => {
  const upcomingGames = mockGames
    .filter((game) => game.status === "SCHEDULED")
    .slice(0, 5);

  const myTeamGames = upcomingGames.filter((game) => game.isClubTeamGame);
  const allGames = upcomingGames;

  // Mock user
  const user = {
    name: "James",
    team: "Div2 Men",
    club: "Grampians Hockey Club",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Welcome Banner */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="py-4 px-6">
          <p className="text-lg font-medium">
            Dashboard home team. Welcome {user.name}
          </p>
        </CardContent>
      </Card>

      {/* Main 2-column Grid - 70/30 ratio */}
      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Club Banner */}
          <Card className="bg-primary text-primary-foreground min-h-[140px]">
            <CardContent className="flex items-center justify-center h-full py-8">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">{user.club}</h2>
                <p className="text-primary-foreground/80">Club banner</p>
              </div>
            </CardContent>
          </Card>

          {/* All Upcoming Games */}
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-primary-foreground">
                All upcoming games
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {allGames.length === 0 ? (
                <p className="text-primary-foreground/70 text-sm">No upcoming games</p>
              ) : (
                allGames.slice(0, 4).map((game) => (
                  <Link
                    key={game.id}
                    to={`/games/${game.id}`}
                    className="block p-3 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        {game.homeTeamName} vs {game.awayTeamName}
                      </p>
                      <ChevronRight className="h-4 w-4 text-primary-foreground/50" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-primary-foreground/70 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {game.location}
                      </span>
                    </div>
                    {/* Availability Selection */}
                    <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                      <Badge className="bg-green-500/20 text-green-200 border-0 text-xs cursor-pointer hover:bg-green-500/40">
                        Available
                      </Badge>
                      <Badge className="bg-red-500/20 text-red-200 border-0 text-xs cursor-pointer hover:bg-red-500/40">
                        Unavailable
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-200 border-0 text-xs cursor-pointer hover:bg-yellow-500/40">
                        Maybe
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
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
                    <div className="flex items-center gap-3 text-xs text-primary-foreground/70">
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

        {/* Right Column - Calendar */}
        <Card className="bg-primary text-primary-foreground h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-primary-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simple week view */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i} className="py-1 text-primary-foreground/70 font-medium">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const dayNum = i - 2;
                const isToday = dayNum === new Date().getDate();
                const hasGame = [28, 4].includes(dayNum);
                return (
                  <div
                    key={i}
                    className={`py-1.5 rounded-full text-sm ${
                      dayNum < 1 || dayNum > 31
                        ? "text-transparent"
                        : isToday
                        ? "bg-primary-foreground text-primary font-semibold"
                        : hasGame
                        ? "bg-primary-foreground/20 text-primary-foreground font-medium"
                        : "text-primary-foreground"
                    }`}
                  >
                    {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
