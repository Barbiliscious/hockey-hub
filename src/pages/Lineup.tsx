import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Calendar, Clock, MapPin } from "lucide-react";
import { mockGames } from "@/lib/mockData";
import { LineupView } from "@/components/lineup/LineupView";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Lineup = () => {
  const { id } = useParams();
  const game = mockGames.find((g) => g.id === id);
  
  // Mock: toggle between coach and player view for demo
  const [isCoachView, setIsCoachView] = useState(true);

  if (!game) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Game not found</p>
        <Link to="/games">
          <Button variant="link">Back to games</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to={`/games/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Game
          </Button>
        </Link>
        
        {/* Demo toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">View as:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setIsCoachView(true)}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                isCoachView
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              Coach
            </button>
            <button
              onClick={() => setIsCoachView(false)}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                !isCoachView
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              Player
            </button>
          </div>
        </div>
      </div>

      {/* Game Info Mini Card */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
        <div>
          <p className="font-semibold text-sm">
            {game.homeTeamName} vs {game.awayTeamName}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(game.date).toLocaleDateString("en-AU", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {game.startTime}
            </span>
          </div>
        </div>
        <Badge variant="default">{game.grade}</Badge>
      </div>

      {/* Lineup View */}
      <LineupView
        gameId={game.id}
        teamName="Grampians HC"
        opponentName={
          game.homeTeamName.includes("Grampians")
            ? game.awayTeamName
            : game.homeTeamName
        }
        isCoach={isCoachView}
      />

      {/* Instructions */}
      {isCoachView && (
        <div className="text-center text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">
          <p className="font-medium mb-1">Drag & Drop Instructions</p>
          <p>Drag players from the bench onto positions, or swap players by dragging between positions.</p>
        </div>
      )}
    </div>
  );
};

export default Lineup;
