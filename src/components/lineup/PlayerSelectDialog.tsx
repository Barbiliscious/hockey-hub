import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserMinus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PitchPosition, SelectedPlayer } from "./types";
import { POSITION_LABELS } from "./types";

interface PlayerSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: PitchPosition | null;
  availablePlayers: SelectedPlayer[];
  currentPlayer: SelectedPlayer | null;
  onSelectPlayer: (playerId: string) => void;
  onRemovePlayer: () => void;
}

export const PlayerSelectDialog = ({
  isOpen,
  onClose,
  position,
  availablePlayers,
  currentPlayer,
  onSelectPlayer,
  onRemovePlayer,
}: PlayerSelectDialogProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const positionLabel = position ? POSITION_LABELS[position.id] || position.label : "";

  // Filter and group players
  const { recommended, others } = useMemo(() => {
    const filtered = availablePlayers.filter((player) => {
      const query = searchQuery.toLowerCase();
      return (
        player.name.toLowerCase().includes(query) ||
        player.number.toString().includes(query)
      );
    });

    const recommended: SelectedPlayer[] = [];
    const others: SelectedPlayer[] = [];

    filtered.forEach((player) => {
      if (player.preferredPosition === positionLabel) {
        recommended.push(player);
      } else {
        others.push(player);
      }
    });

    return { recommended, others };
  }, [availablePlayers, searchQuery, positionLabel]);

  const handleSelectPlayer = (playerId: string) => {
    onSelectPlayer(playerId);
    setSearchQuery("");
  };

  const handleRemove = () => {
    onRemovePlayer();
    setSearchQuery("");
  };

  const handleClose = () => {
    onClose();
    setSearchQuery("");
  };

  const PlayerRow = ({ player }: { player: SelectedPlayer }) => (
    <button
      onClick={() => handleSelectPlayer(player.id)}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
        {player.number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{player.name}</p>
        {player.preferredPosition && (
          <p className="text-xs text-muted-foreground">{player.preferredPosition}</p>
        )}
      </div>
      {player.preferredPosition === positionLabel && (
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      )}
    </button>
  );

  const DialogContentInner = () => (
    <div className="flex flex-col gap-4">
      {/* Current Player */}
      {currentPlayer && (
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-xs text-muted-foreground mb-2">Currently assigned</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {currentPlayer.number}
              </div>
              <div>
                <p className="font-medium">{currentPlayer.name}</p>
                {currentPlayer.preferredPosition && (
                  <p className="text-xs text-muted-foreground">
                    {currentPlayer.preferredPosition}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <UserMinus className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Player List */}
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-4">
          {/* Recommended */}
          {recommended.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  Recommended
                </Badge>
              </div>
              <div className="space-y-1">
                {recommended.map((player) => (
                  <PlayerRow key={player.id} player={player} />
                ))}
              </div>
            </div>
          )}

          {/* Other Available */}
          {others.length > 0 && (
            <div>
              {recommended.length > 0 && (
                <p className="text-xs text-muted-foreground mb-2">Other available</p>
              )}
              <div className="space-y-1">
                {others.map((player) => (
                  <PlayerRow key={player.id} player={player} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {recommended.length === 0 && others.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {searchQuery ? "No players found" : "No available players"}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select {positionLabel}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <DialogContentInner />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select {positionLabel}</DialogTitle>
        </DialogHeader>
        <DialogContentInner />
      </DialogContent>
    </Dialog>
  );
};
