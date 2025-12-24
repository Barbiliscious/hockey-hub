import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Shield, Users, Save, Lock } from "lucide-react";
import { positions } from "@/lib/mockData";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "James Wilson",
    email: "james@example.com",
    preferredPositions: ["Centre Forward", "Left Wing"],
  });

  const user = {
    ...formData,
    role: "PLAYER" as const,
    club: "Grampians Hockey Club",
    team: "Div2 Men",
    memberSince: "2024",
    gamesPlayed: 8,
    goals: 5,
    jerseyNumber: 7,
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handlePositionToggle = (position: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredPositions: prev.preferredPositions.includes(position)
        ? prev.preferredPositions.filter((p) => p !== position)
        : [...prev.preferredPositions, position],
    }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-4xl mx-auto mb-4">
          {user.name.charAt(0)}
        </div>
        <h1 className="font-display text-3xl text-foreground">{user.name}</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge variant="player">{user.role}</Badge>
          <Badge variant="outline">#{user.jerseyNumber}</Badge>
        </div>
        <p className="text-muted-foreground mt-2">
          {user.club} • {user.team}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="elevated" className="text-center">
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">{user.gamesPlayed}</p>
            <p className="text-xs text-muted-foreground">Games Played</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="text-center">
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">{user.goals}</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="text-center">
          <CardContent className="pt-5">
            <p className="font-display text-3xl text-accent">{user.memberSince}</p>
            <p className="text-xs text-muted-foreground">Member Since</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            ) : (
              <p className="text-foreground py-2.5">{formData.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-foreground">{formData.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Positions</Label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {positions.map((position) => (
                  <Badge
                    key={position}
                    variant={
                      formData.preferredPositions.includes(position)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer transition-all"
                    onClick={() => handlePositionToggle(position)}
                  >
                    {position}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.preferredPositions.map((position) => (
                  <Badge key={position} variant="default">
                    {position}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Club & Team Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Club & Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{user.club}</p>
              <p className="text-sm text-muted-foreground">Club</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{user.team}</p>
              <p className="text-sm text-muted-foreground">Team</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
