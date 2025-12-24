import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Filter,
  CalendarDays,
  List,
} from "lucide-react";
import { mockGames } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const Games = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [filter, setFilter] = useState<"all" | "club" | "other">("all");

  const filteredGames = mockGames.filter((game) => {
    if (filter === "club") return game.isClubTeamGame;
    if (filter === "other") return !game.isClubTeamGame;
    return true;
  });

  const upcomingGames = filteredGames.filter(
    (game) => new Date(game.date) >= new Date()
  );
  const pastGames = filteredGames.filter(
    (game) => new Date(game.date) < new Date()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            FIXTURES
          </h1>
          <p className="text-muted-foreground mt-1">
            View all games and mark your availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "calendar" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Games
        </Button>
        <Button
          variant={filter === "club" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("club")}
        >
          Club Games
        </Button>
        <Button
          variant={filter === "other" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("other")}
        >
          Other Fixtures
        </Button>
      </div>

      {/* Games Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingGames.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastGames.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingGames.length === 0 ? (
            <EmptyState message="No upcoming games scheduled." />
          ) : (
            <div className="space-y-3">
              {upcomingGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {pastGames.length === 0 ? (
            <EmptyState message="No past games yet." />
          ) : (
            <div className="space-y-3">
              {pastGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} isPast />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GameCardProps {
  game: (typeof mockGames)[0];
  index: number;
  isPast?: boolean;
}

const GameCard = ({ game, index, isPast }: GameCardProps) => (
  <Link to={`/games/${game.id}`}>
    <Card
      variant="game"
      className={cn(
        "animate-slide-up",
        isPast && "opacity-75"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Date */}
            <div className="text-center min-w-[55px] py-1">
              <p className="text-xs text-muted-foreground uppercase">
                {new Date(game.date).toLocaleDateString("en-AU", {
                  weekday: "short",
                })}
              </p>
              <p className="font-display text-2xl text-foreground">
                {new Date(game.date).getDate()}
              </p>
              <p className="text-xs text-muted-foreground uppercase">
                {new Date(game.date).toLocaleDateString("en-AU", {
                  month: "short",
                })}
              </p>
            </div>

            {/* Match Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={game.isClubTeamGame ? "default" : "outline"}
                  className="text-xs"
                >
                  {game.grade}
                </Badge>
                {!game.isClubTeamGame && (
                  <Badge variant="outline" className="text-xs">
                    Other
                  </Badge>
                )}
                {isPast && game.status === "FINALISED" && (
                  <Badge variant="finalised" className="text-xs">
                    Finalised
                  </Badge>
                )}
              </div>

              <p className="font-semibold text-foreground truncate">
                {game.homeTeamName} vs {game.awayTeamName}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {game.startTime}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{game.location}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex flex-col items-end gap-2">
            {game.isClubTeamGame && !isPast && (
              <Badge variant="available">Available</Badge>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const EmptyState = ({ message }: { message: string }) => (
  <Card variant="ghost" className="text-center py-12">
    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <p className="text-muted-foreground">{message}</p>
  </Card>
);

export default Games;
