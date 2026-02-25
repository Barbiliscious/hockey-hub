import { cn } from "@/lib/utils";
import { useDrop } from "react-dnd";
import type { PitchPosition as PitchPositionType, SelectedPlayer, DragItem } from "./types";
import { PlayerChip } from "./PlayerChip";

interface PitchPositionProps {
  position: PitchPositionType;
  player: SelectedPlayer | null;
  onDrop: (playerId: string, positionId: string) => void;
  isCoach?: boolean;
  onPositionClick?: (positionId: string) => void;
  isSelected?: boolean;
}

export const PitchPosition = ({
  position,
  player,
  onDrop,
  isCoach = false,
  onPositionClick,
  isSelected = false,
}: PitchPositionProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "PLAYER",
      drop: (item: DragItem) => {
        onDrop(item.playerId, position.id);
      },
      canDrop: () => isCoach,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [position.id, onDrop, isCoach]
  );

  const handleClick = () => {
    if (isCoach && onPositionClick) {
      onPositionClick(position.id);
    }
  };

  return (
    <div
      ref={drop}
      onClick={handleClick}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-transform",
        isCoach && "cursor-pointer hover:scale-105"
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      {player ? (
        <div className={cn(
          "rounded-full transition-all",
          isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-[#2d8a4e]"
        )}>
          <PlayerChip
            player={player}
            isOnPitch
            isDraggable={isCoach}
            size="sm"
          />
        </div>
      ) : (
        <div
          className={cn(
            "w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all",
            isSelected
              ? "border-accent bg-accent/40 scale-110 ring-2 ring-accent"
              : isOver && canDrop
              ? "border-accent bg-accent/30 scale-110"
              : canDrop
              ? "border-white/50 bg-white/10"
              : "border-white/30 bg-white/5"
          )}
        >
          <span className="text-white/70 text-xs font-semibold">
            {position.label}
          </span>
        </div>
      )}
    </div>
  );
};
