import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import type { SelectedPlayer, DragItem } from "./types";
import { PlayerChip } from "./PlayerChip";
import { POSITION_LABELS } from "./types";

interface BenchAreaProps {
  players: SelectedPlayer[];
  onDropToBench: (playerId: string) => void;
  isCoach?: boolean;
}

export const BenchArea = ({ players, onDropToBench, isCoach = false }: BenchAreaProps) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "PLAYER",
      drop: (item: DragItem) => {
        onDropToBench(item.playerId);
      },
      canDrop: () => isCoach,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDropToBench, isCoach]
  );

  const startersOnBench = players.filter((p) => !p.positionId && p.isStarter);
  const reserves = players.filter((p) => !p.isStarter);

  return (
    <div
      ref={drop}
      className={cn(
        "mt-4 p-4 rounded-xl border-2 border-dashed transition-all",
        isOver ? "border-accent bg-accent/10" : "border-border bg-muted/30"
      )}
    >
      {startersOnBench.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Unpositioned Starters
          </h4>
          <div className="flex flex-wrap gap-2">
            {startersOnBench.map((player) => (
              <PlayerChip
                key={player.id}
                player={player}
                positionLabel={player.preferredPosition}
                isDraggable={isCoach}
                isHighlighted
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Bench / Reserves
        </h4>
        {reserves.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {reserves.map((player) => (
              <PlayerChip
                key={player.id}
                player={player}
                positionLabel={player.preferredPosition}
                isDraggable={isCoach}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No reserves</p>
        )}
      </div>
    </div>
  );
};
