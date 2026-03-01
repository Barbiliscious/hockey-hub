import { useState, useEffect } from "react";
import { useTeamContext } from "@/contexts/TeamContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AssociationProfile = () => {
  const { selectedAssociation, selectedAssociationId } = useTeamContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ clubs: 0, teams: 0, players: 0 });

  useEffect(() => {
    if (selectedAssociation) {
      setName(selectedAssociation.name);
      setAbbreviation(selectedAssociation.abbreviation || "");
    }
  }, [selectedAssociation]);

  useEffect(() => {
    if (!selectedAssociationId) return;
    const fetchStats = async () => {
      const [clubsRes, teamsRes] = await Promise.all([
        supabase.from("clubs").select("id", { count: "exact", head: true }).eq("association_id", selectedAssociationId),
        supabase.from("clubs").select("id").eq("association_id", selectedAssociationId),
      ]);
      const clubIds = teamsRes.data?.map(c => c.id) || [];
      let teamCount = 0;
      if (clubIds.length > 0) {
        const { count } = await supabase.from("teams").select("id", { count: "exact", head: true }).in("club_id", clubIds);
        teamCount = count || 0;
      }
      setStats({ clubs: clubsRes.count || 0, teams: teamCount, players: 0 });
    };
    fetchStats();
  }, [selectedAssociationId]);

  const handleSave = async () => {
    if (!selectedAssociationId) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("associations")
      .update({ name, abbreviation: abbreviation || null })
      .eq("id", selectedAssociationId);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Association details updated." });
    }
    setIsSaving(false);
  };

  if (!selectedAssociation) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select an association from the header to view its profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Association Profile</h1>
        <p className="text-muted-foreground">Manage association details and branding</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.clubs}</p>
              <p className="text-xs text-muted-foreground">Clubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.teams}</p>
              <p className="text-xs text-muted-foreground">Teams</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.players}</p>
              <p className="text-xs text-muted-foreground">Players</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Association name, abbreviation, and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={selectedAssociation.logo_url || undefined} alt={selectedAssociation.name} />
              <AvatarFallback className="text-lg font-bold">
                {selectedAssociation.abbreviation || selectedAssociation.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{selectedAssociation.name}</p>
              {selectedAssociation.abbreviation && (
                <Badge variant="secondary">{selectedAssociation.abbreviation}</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abbreviation">Abbreviation</Label>
            <Input id="abbreviation" value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} placeholder="e.g. GHA" />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationProfile;
