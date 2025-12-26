import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Lock, Shield, Users } from "lucide-react";
import { currentUser, getAssociationById } from "@/lib/mockData";
import { PersonalDetailsSection } from "@/components/profile/PersonalDetailsSection";
import { TeamMembershipSection } from "@/components/profile/TeamMembershipSection";
import { PendingInvitesSection } from "@/components/profile/PendingInvitesSection";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    phone: currentUser.phone,
    suburb: currentUser.suburb,
    dateOfBirth: currentUser.dateOfBirth,
    emergencyContact: { ...currentUser.emergencyContact },
  });

  const association = getAssociationById(currentUser.associationId);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleFormChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleRequestPrimaryChange = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Primary team change requests will be available soon.",
    });
  };

  const handleAcceptInvite = (inviteId: string) => {
    toast({
      title: "Invite Accepted",
      description: "You've been added to the team.",
    });
  };

  const handleDeclineInvite = (inviteId: string) => {
    toast({
      title: "Invite Declined",
      description: "The coach has been notified.",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-4xl mx-auto mb-4">
          {currentUser.name.charAt(0)}
        </div>
        <h1 className="font-display text-3xl text-foreground">{currentUser.name}</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="default">PLAYER</Badge>
          {currentUser.primaryTeam?.jerseyNumber && (
            <Badge variant="outline">#{currentUser.primaryTeam.jerseyNumber}</Badge>
          )}
        </div>
        {association && (
          <p className="text-muted-foreground mt-2">
            {currentUser.primaryTeam?.clubName} • {association.name}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">8</p>
            <p className="text-xs text-muted-foreground">Games Played</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">5</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">2024</p>
            <p className="text-xs text-muted-foreground">Member Since</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invites */}
      <PendingInvitesSection
        invites={currentUser.pendingInvites}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
      />

      {/* Personal Details with Edit */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Profile Details</CardTitle>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              "Edit"
            )}
          </Button>
        </CardHeader>
      </Card>

      <PersonalDetailsSection
        profile={currentUser}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleFormChange}
      />

      {/* Team Memberships */}
      <TeamMembershipSection
        primaryTeam={currentUser.primaryTeam}
        extraTeams={currentUser.extraTeams}
        pendingChangeRequest={currentUser.pendingPrimaryChangeRequest}
        onRequestChange={handleRequestPrimaryChange}
      />

      {/* Association Info */}
      {association && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Association</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{association.name}</p>
                <p className="text-sm text-muted-foreground">{association.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
