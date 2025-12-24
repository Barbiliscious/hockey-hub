import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { mockGames, mockPlayers, type AvailabilityStatus } from "@/lib/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const GameDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const game = mockGames.find((g) => g.id === id);
  const [availability, setAvailability] = useState<AvailabilityStatus>("AVAILABLE");

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

  const handleAvailability = (status: AvailabilityStatus) => {
    setAvailability(status);
    toast({
      title: "Availability Updated",
      description: `You are now marked as ${status.toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link to="/games">
        <Button variant="ghost" size="sm" className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Games
        </Button>
      </Link>

      {/* Game Header Card */}
      <Card variant="gradient">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant={game.isClubTeamGame ? "default" : "outline"}
              className="text-sm"
            >
              {game.grade}
            </Badge>
            <Badge variant={game.status === "SCHEDULED" ? "scheduled" : "finalised"}>
              {game.status}
            </Badge>
          </div>

          <div className="text-center py-8">
            <p className="font-display text-3xl md:text-4xl text-foreground">
              {game.homeTeamName}
            </p>
            <p className="text-muted-foreground text-xl my-3">vs</p>
            <p className="font-display text-3xl md:text-4xl text-foreground">
              {game.awayTeamName}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-border">
            <div>
              <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-medium text-foreground">
                {new Date(game.date).toLocaleDateString("en-AU", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-medium text-foreground">
                {game.startTime}
              </p>
            </div>
            <div>
              <MapPin className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-medium text-foreground truncate px-2">
                {game.location}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Section (only for club games) */}
      {game.isClubTeamGame && game.status === "SCHEDULED" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Let your coach know if you can play in this match.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <AvailabilityButton
                status="AVAILABLE"
                current={availability}
                onClick={() => handleAvailability("AVAILABLE")}
                icon={<Check className="h-5 w-5" />}
                label="Available"
              />
              <AvailabilityButton
                status="UNAVAILABLE"
                current={availability}
                onClick={() => handleAvailability("UNAVAILABLE")}
                icon={<X className="h-5 w-5" />}
                label="Unavailable"
              />
              <AvailabilityButton
                status="UNSURE"
                current={availability}
                onClick={() => handleAvailability("UNSURE")}
                icon={<HelpCircle className="h-5 w-5" />}
                label="Unsure"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Selection */}
      {game.isClubTeamGame && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Team Selection</CardTitle>
            <Badge variant="starter">Starter</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              You have been selected as a <strong>starter</strong> for this
              match.
            </p>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Selected Players
              </h4>
              <div className="grid gap-2">
                {mockPlayers.slice(0, 6).map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {player.number}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{player.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {player.position}
                        </p>
                      </div>
                    </div>
                    <Badge variant="starter" className="text-xs">
                      Starter
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {game.isClubTeamGame && (
        <div className="flex gap-3">
          <Button variant="default" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            View Lineup
          </Button>
          {game.status === "FINALISED" && (
            <Button variant="secondary" className="flex-1">
              Vote Now
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

interface AvailabilityButtonProps {
  status: AvailabilityStatus;
  current: AvailabilityStatus;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const AvailabilityButton = ({
  status,
  current,
  onClick,
  icon,
  label,
}: AvailabilityButtonProps) => {
  const isSelected = status === current;

  const variants = {
    AVAILABLE: {
      selected: "bg-success text-success-foreground border-success",
      default: "border-success/50 text-success hover:bg-success/10",
    },
    UNAVAILABLE: {
      selected: "bg-destructive text-destructive-foreground border-destructive",
      default: "border-destructive/50 text-destructive hover:bg-destructive/10",
    },
    UNSURE: {
      selected: "bg-warning text-warning-foreground border-warning",
      default: "border-warning/50 text-warning-foreground hover:bg-warning/10",
    },
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
        isSelected ? variants[status].selected : variants[status].default
      )}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default GameDetail;
