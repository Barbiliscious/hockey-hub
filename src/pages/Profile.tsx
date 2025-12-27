import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Lock, Camera, Settings, Wrench } from "lucide-react";
import {
  currentUser,
  getAssociationById,
  mockPlayerGames,
  mockPlayerGoals,
  type Role,
} from "@/lib/mockData";
import { PersonalDetailsSection } from "@/components/profile/PersonalDetailsSection";
import { TeamMembershipSection } from "@/components/profile/TeamMembershipSection";
import { PendingInvitesSection } from "@/components/profile/PendingInvitesSection";
import { ProfilePhotoCropper } from "@/components/profile/ProfilePhotoCropper";
import { StatsDetailDialog } from "@/components/profile/StatsDetailDialog";
import { uploadAvatar, deleteAvatar } from "@/lib/uploadAvatar";
import { useTestRole } from "@/contexts/TestRoleContext";

const ALL_ROLES: Role[] = ["PLAYER", "COACH", "CLUB_ADMIN", "ASSOCIATION_ADMIN", "SYSTEM_ADMIN"];

const getRoleDisplayName = (role: Role): string => {
  const names: Record<Role, string> = {
    PLAYER: "Player",
    COACH: "Coach",
    CLUB_ADMIN: "Club Admin",
    ASSOCIATION_ADMIN: "Association Admin",
    SYSTEM_ADMIN: "System Admin",
  };
  return names[role];
};

const getRoleEmoji = (role: Role): string => {
  const emojis: Record<Role, string> = {
    PLAYER: "🏃",
    COACH: "📋",
    CLUB_ADMIN: "🏢",
    ASSOCIATION_ADMIN: "🏛️",
    SYSTEM_ADMIN: "⚙️",
  };
  return emojis[role];
};

const Profile = () => {
  const { toast } = useToast();
  const { testRole, setTestRole } = useTestRole();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    currentUser.avatarUrl
  );
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [statsDialogType, setStatsDialogType] = useState<"games" | "goals">(
    "games"
  );
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

  const handleAvatarSave = async (blob: Blob) => {
    setIsAvatarLoading(true);
    // Optimistic update
    const tempUrl = URL.createObjectURL(blob);
    setAvatarUrl(tempUrl);

    try {
      const newUrl = await uploadAvatar(currentUser.id, blob);
      setAvatarUrl(newUrl);
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated.",
      });
    } catch (error) {
      // Revert on error
      setAvatarUrl(currentUser.avatarUrl);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    setIsAvatarLoading(true);
    const previousUrl = avatarUrl;
    setAvatarUrl(undefined);

    try {
      await deleteAvatar(currentUser.id);
      toast({
        title: "Photo Removed",
        description: "Your profile photo has been removed.",
      });
    } catch (error) {
      setAvatarUrl(previousUrl);
      toast({
        title: "Delete Failed",
        description: "Failed to remove photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const openStatsDialog = (type: "games" | "goals") => {
    setStatsDialogType(type);
    setStatsDialogOpen(true);
  };

  const handleRoleChange = (role: Role) => {
    setTestRole(role);
    toast({
      title: "Test Role Changed",
      description: `Now viewing as ${getRoleDisplayName(role)}. Sidebar navigation updated.`,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pb-8">
      {/* Header */}
      <div className="text-center">
        <div
          className="relative group cursor-pointer mx-auto w-24 h-24 mb-4"
          onClick={() => setCropperOpen(true)}
        >
          {isAvatarLoading ? (
            <Skeleton className="w-24 h-24 rounded-full" />
          ) : (
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage src={avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="text-4xl font-display bg-primary text-primary-foreground">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-foreground" />
          </div>
        </div>
        <h1 className="font-display text-3xl text-foreground">
          {currentUser.name}
        </h1>
        {currentUser.primaryTeam && association && (
          <p className="text-muted-foreground mt-2">
            {currentUser.primaryTeam.clubName} • {association.name}
          </p>
        )}
        
        {/* User Roles Display */}
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          <Badge variant="secondary" className="text-xs">
            {getRoleEmoji(testRole)} {getRoleDisplayName(testRole)}
          </Badge>
        </div>
      </div>

      {/* Pending Invites - Moved up */}
      <PendingInvitesSection
        invites={currentUser.pendingInvites}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
      />

      {/* Stats Cards - Clickable */}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => openStatsDialog("games")}
        >
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">
              {mockPlayerGames.length}
            </p>
            <p className="text-xs text-muted-foreground">Games Played</p>
          </CardContent>
        </Card>
        <Card
          className="text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => openStatsDialog("goals")}
        >
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">
              {mockPlayerGoals.length}
            </p>
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

      {/* Team Memberships */}
      <TeamMembershipSection
        primaryTeam={currentUser.primaryTeam}
        extraTeams={currentUser.extraTeams}
        pendingChangeRequest={currentUser.pendingPrimaryChangeRequest}
        onRequestChange={handleRequestPrimaryChange}
      />

      {/* Personal Details with Edit */}
      <PersonalDetailsSection
        profile={currentUser}
        isEditing={isEditing}
        formData={formData}
        onFormChange={handleFormChange}
        onEditToggle={() => (isEditing ? handleSave() : setIsEditing(true))}
      />

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

      {/* Developer Tools - Role Switcher */}
      <Card className="border-dashed border-amber-500/50 bg-amber-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-500" />
            Developer Tools
            <Badge variant="outline" className="text-amber-600 border-amber-500 text-xs">
              Testing Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-select">Active Role (for testing)</Label>
            <Select value={testRole} onValueChange={(val) => handleRoleChange(val as Role)}>
              <SelectTrigger id="role-select" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {getRoleEmoji(role)} {getRoleDisplayName(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Switching roles updates the sidebar navigation immediately. 
              This is for UI testing only and does not bypass actual security.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Photo Cropper Dialog */}
      <ProfilePhotoCropper
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        onSave={handleAvatarSave}
        onDelete={avatarUrl ? handleAvatarDelete : undefined}
        currentImage={avatarUrl}
      />

      {/* Stats Detail Dialog */}
      <StatsDetailDialog
        open={statsDialogOpen}
        onOpenChange={setStatsDialogOpen}
        type={statsDialogType}
        games={mockPlayerGames}
        goals={mockPlayerGoals}
      />
    </div>
  );
};

export default Profile;
