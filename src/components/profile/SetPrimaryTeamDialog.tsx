import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Loader2 } from "lucide-react";

interface TeamOption {
  id: string;
  teamName: string;
  clubName: string;
  associationName: string;
  position?: string;
  jerseyNumber?: number;
}

interface SetPrimaryTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: TeamOption[];
  currentPrimaryTeamId?: string;
  onConfirm: (teamId: string) => Promise<void>;
  isChangingPrimary: boolean; // true if user already has a primary team
}

export const SetPrimaryTeamDialog = ({
  open,
  onOpenChange,
  teams,
  currentPrimaryTeamId,
  onConfirm,
  isChangingPrimary,
}: SetPrimaryTeamDialogProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter out the current primary team from options
  const availableTeams = teams.filter((t) => t.id !== currentPrimaryTeamId);

  const handleConfirm = async () => {
    if (!selectedTeamId) return;
    setIsLoading(true);
    try {
      await onConfirm(selectedTeamId);
      setSelectedTeamId("");
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedTeamId("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isChangingPrimary ? "Request Primary Team Change" : "Set Primary Team"}
          </DialogTitle>
          <DialogDescription>
            {isChangingPrimary
              ? "Select which team you want to make your primary team. Your request will need to be approved by a coach or admin."
              : "Select which team you want to set as your primary team."}
          </DialogDescription>
        </DialogHeader>

        {availableTeams.length === 0 ? (
          <div className="py-6 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No eligible teams available</p>
            <p className="text-sm text-muted-foreground mt-1">
              You need at least one approved team membership to set a primary team.
            </p>
          </div>
        ) : (
          <RadioGroup
            value={selectedTeamId}
            onValueChange={setSelectedTeamId}
            className="space-y-3"
          >
            {availableTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedTeamId(team.id)}
              >
                <RadioGroupItem value={team.id} id={team.id} />
                <Label htmlFor={team.id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">{team.teamName}</p>
                    <p className="text-sm text-muted-foreground">
                      {team.clubName} • {team.associationName}
                    </p>
                    {(team.position || team.jerseyNumber) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {team.position}
                        {team.jerseyNumber && ` • #${team.jerseyNumber}`}
                      </p>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTeamId || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isChangingPrimary ? "Request Change" : "Set as Primary"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
