import { cn } from "@/lib/utils";
import { useDrag } from "react-dnd";
import type { SelectedPlayer } from "./types";

interface PlayerChipProps {
  player: SelectedPlayer;
  positionLabel?: string;
  isOnPitch?: boolean;
  isDraggable?: boolean;
  isHighlighted?: boolean;
  size?: "sm" | "md";
}

export const PlayerChip = ({
  player,
  positionLabel,
  isOnPitch = false,
  isDraggable = false,
  isHighlighted = false,
  size = "md",
}: PlayerChipProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "PLAYER",
      item: { playerId: player.id, sourcePositionId: player.positionId },
      canDrag: isDraggable,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [player.id, player.positionId, isDraggable]
  );

  return (
    <div
      ref={isDraggable ? drag : undefined}
      className={cn(
        "flex items-center gap-2 rounded-full transition-all duration-200",
        isOnPitch
          ? "bg-primary shadow-lg px-2 py-1"
          : "bg-card border border-border px-3 py-2",
        isDraggable && "cursor-grab active:cursor-grabbing hover:scale-105",
        isDragging && "opacity-50 scale-95",
        isHighlighted && "ring-2 ring-accent ring-offset-2 ring-offset-background",
        size === "sm" ? "text-xs" : "text-sm"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold",
          isOnPitch
            ? "bg-white text-primary w-6 h-6 text-xs"
            : "bg-primary text-primary-foreground w-8 h-8"
        )}
      >
        {player.number}
      </div>
      <div className={cn("font-medium", isOnPitch ? "text-primary-foreground" : "text-foreground")}>
        {isOnPitch ? player.name.split(" ").pop() : player.name}
      </div>
      {positionLabel && !isOnPitch && (
        <span className="text-muted-foreground text-xs">({positionLabel})</span>
      )}
    </div>
  );
};
