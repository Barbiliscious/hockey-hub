import { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { HockeyPitch } from "./HockeyPitch";
import { PitchPosition } from "./PitchPosition";
import { BenchArea } from "./BenchArea";
import { PITCH_POSITIONS, POSITION_LABELS, type SelectedPlayer } from "./types";

interface LineupViewProps {
  gameId: string;
  teamName: string;
  opponentName: string;
  isCoach?: boolean;
  initialPlayers?: SelectedPlayer[];
}

// Detect touch device
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const LineupView = ({
  gameId,
  teamName,
  opponentName,
  isCoach = false,
  initialPlayers,
}: LineupViewProps) => {
  const { toast } = useToast();
  
  // Mock initial data - would come from API
  const [players, setPlayers] = useState<SelectedPlayer[]>(
    initialPlayers || [
      { id: "1", name: "James Wilson", number: 7, positionId: "cf", isStarter: true, preferredPosition: "Centre Forward" },
      { id: "2", name: "Sarah Chen", number: 1, positionId: "gk", isStarter: true, preferredPosition: "Goalkeeper" },
      { id: "3", name: "Marcus Lee", number: 11, positionId: "lw", isStarter: true, preferredPosition: "Left Wing" },
      { id: "4", name: "Emily Brown", number: 6, positionId: "ch", isStarter: true, preferredPosition: "Centre Half" },
      { id: "5", name: "David Singh", number: 4, positionId: "rh", isStarter: true, preferredPosition: "Right Half" },
      { id: "6", name: "Olivia Taylor", number: 3, positionId: "fb", isStarter: true, preferredPosition: "Fullback" },
      { id: "7", name: "Tom Mitchell", number: 9, positionId: "rw", isStarter: true, preferredPosition: "Right Wing" },
      { id: "8", name: "Lucy Walker", number: 8, positionId: "li", isStarter: true, preferredPosition: "Left Inside" },
      { id: "9", name: "Ryan James", number: 5, positionId: "ri", isStarter: true, preferredPosition: "Right Inside" },
      { id: "10", name: "Sophie Adams", number: 2, positionId: "lh", isStarter: true, preferredPosition: "Left Half" },
      { id: "11", name: "Chris Evans", number: 10, positionId: null, isStarter: true, preferredPosition: "Centre Forward" },
      { id: "12", name: "Mia Johnson", number: 14, positionId: null, isStarter: false, preferredPosition: "Left Wing" },
      { id: "13", name: "Jake Williams", number: 15, positionId: null, isStarter: false, preferredPosition: "Fullback" },
    ]
  );

  const [hasChanges, setHasChanges] = useState(false);

  const handleDrop = useCallback((playerId: string, positionId: string) => {
    setPlayers((prev) => {
      // Find if there's already a player in this position
      const existingPlayer = prev.find((p) => p.positionId === positionId);
      const droppedPlayer = prev.find((p) => p.id === playerId);

      if (!droppedPlayer) return prev;

      return prev.map((player) => {
        // The dropped player takes the new position
        if (player.id === playerId) {
          return { ...player, positionId, isStarter: true };
        }
        // The existing player (if any) goes to bench or swaps
        if (existingPlayer && player.id === existingPlayer.id) {
          return { ...player, positionId: droppedPlayer.positionId };
        }
        return player;
      });
    });
    setHasChanges(true);
  }, []);

  const handleDropToBench = useCallback((playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, positionId: null, isStarter: false }
          : player
      )
    );
    setHasChanges(true);
  }, []);

  const handleSave = () => {
    // TODO: Save to API
    toast({
      title: "Lineup Saved",
      description: "The team lineup has been updated.",
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to initial state
    setPlayers(initialPlayers || []);
    setHasChanges(false);
    toast({
      title: "Lineup Reset",
      description: "Changes have been discarded.",
    });
  };

  const getPlayerAtPosition = (positionId: string): SelectedPlayer | null => {
    return players.find((p) => p.positionId === positionId) || null;
  };

  const benchPlayers = players.filter((p) => !p.positionId || !p.isStarter);
  const startersCount = players.filter((p) => p.isStarter && p.positionId).length;

  // Choose backend based on device type
  const DndBackend = isTouchDevice() ? TouchBackend : HTML5Backend;
  const backendOptions = isTouchDevice() ? { enableMouseEvents: true } : undefined;

  return (
    <DndProvider backend={DndBackend} options={backendOptions}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{teamName} Lineup</CardTitle>
              <p className="text-sm text-muted-foreground">vs {opponentName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {startersCount}/11
              </Badge>
              {!isCoach && (
                <Badge variant="secondary" className="gap-1">
                  <Eye className="h-3 w-3" />
                  View Only
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Starter</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border-2 border-dashed border-white/50" />
              <span>Empty Position</span>
            </div>
            {isCoach && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>Drop Zone</span>
              </div>
            )}
          </div>

          {/* Hockey Pitch */}
          <HockeyPitch>
            {PITCH_POSITIONS.map((position) => (
              <PitchPosition
                key={position.id}
                position={position}
                player={getPlayerAtPosition(position.id)}
                onDrop={handleDrop}
                isCoach={isCoach}
              />
            ))}
          </HockeyPitch>

          {/* Bench Area */}
          <BenchArea
            players={players}
            onDropToBench={handleDropToBench}
            isCoach={isCoach}
          />

          {/* Coach Actions */}
          {isCoach && (
            <div className="flex gap-3 mt-4">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Lineup
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DndProvider>
  );
};
