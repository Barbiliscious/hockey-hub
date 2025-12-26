import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Clock, User, Check, X } from "lucide-react";
import type { TeamInvite } from "@/lib/mockData";

interface PendingInvitesSectionProps {
  invites: TeamInvite[];
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
}

export const PendingInvitesSection = ({
  invites,
  onAccept,
  onDecline,
}: PendingInvitesSectionProps) => {
  const pendingInvites = invites.filter((inv) => inv.status === "PENDING");

  if (pendingInvites.length === 0) {
    return null;
  }

  const getDaysUntilExpiry = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="border-accent border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">Pending Invites</CardTitle>
          <Badge variant="default" className="ml-auto">
            {pendingInvites.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingInvites.map((invite) => {
          const daysLeft = getDaysUntilExpiry(invite.expiresAt);
          const isUrgent = daysLeft <= 3;

          return (
            <div
              key={invite.id}
              className="p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">
                      {invite.teamName}
                    </p>
                    <Badge
                      variant={invite.type === "FILL_IN" ? "outline" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {invite.type === "FILL_IN" ? "Fill-in" : "Permanent"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invite.clubName}</p>

                  {/* Game date for fill-ins */}
                  {invite.type === "FILL_IN" && invite.gameDate && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="text-foreground">
                        Game:{" "}
                        {new Date(invite.gameDate).toLocaleDateString("en-AU", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}

                  {/* Coach & Expiry */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>From: {invite.sentBy}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        isUrgent ? "text-destructive" : ""
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      <span>
                        {daysLeft > 0
                          ? `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
                          : "Expires today"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onAccept(invite.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDecline(invite.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
