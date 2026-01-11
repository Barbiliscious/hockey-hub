import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Trophy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import type { Database } from "@/integrations/supabase/types";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type Club = Database["public"]["Tables"]["clubs"]["Row"];
type Association = Database["public"]["Tables"]["associations"]["Row"];

interface TeamWithClub extends Team {
  clubs: { name: string; association_id: string } | null;
}

const TeamsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: roleLoading, isAdmin } = useUserRole();
  
  const [teams, setTeams] = useState<TeamWithClub[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAssociation, setFilterAssociation] = useState<string>("all");
  const [filterClub, setFilterClub] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamWithClub | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState<TeamWithClub | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    club_id: "",
    age_group: "",
    division: "",
    gender: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin()) {
      navigate("/dashboard");
    }
  }, [roleLoading, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);

    const [teamsRes, clubsRes, associationsRes] = await Promise.all([
      supabase
        .from("teams")
        .select("*, clubs:club_id(name, association_id)")
        .order("name"),
      supabase.from("clubs").select("*").order("name"),
      supabase.from("associations").select("*").order("name"),
    ]);

    if (teamsRes.error) {
      toast({ title: "Error", description: "Failed to load teams", variant: "destructive" });
    } else {
      setTeams(teamsRes.data || []);
    }

    if (!clubsRes.error) setClubs(clubsRes.data || []);
    if (!associationsRes.error) setAssociations(associationsRes.data || []);

    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchData();
    }
  }, [isAdmin]);

  // Filter clubs based on selected association
  const filteredClubsForDropdown = filterAssociation === "all"
    ? clubs
    : clubs.filter((c) => c.association_id === filterAssociation);

  // Filter teams based on both filters
  let filteredTeams = teams;
  if (filterAssociation !== "all") {
    filteredTeams = filteredTeams.filter((t) => t.clubs?.association_id === filterAssociation);
  }
  if (filterClub !== "all") {
    filteredTeams = filteredTeams.filter((t) => t.club_id === filterClub);
  }

  // Reset club filter when association changes
  useEffect(() => {
    setFilterClub("all");
  }, [filterAssociation]);

  const handleOpenDialog = (team?: TeamWithClub) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        club_id: team.club_id,
        age_group: team.age_group || "",
        division: team.division || "",
        gender: team.gender || "",
      });
    } else {
      setEditingTeam(null);
      setFormData({ name: "", club_id: "", age_group: "", division: "", gender: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.club_id) {
      toast({ title: "Error", description: "Name and Club are required", variant: "destructive" });
      return;
    }

    setSaving(true);

    const teamData = {
      name: formData.name.trim(),
      club_id: formData.club_id,
      age_group: formData.age_group.trim() || null,
      division: formData.division.trim() || null,
      gender: formData.gender || null,
    };

    if (editingTeam) {
      const { error } = await supabase.from("teams").update(teamData).eq("id", editingTeam.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update team", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Team updated" });
        setDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase.from("teams").insert(teamData);

      if (error) {
        toast({ title: "Error", description: "Failed to create team", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Team created" });
        setDialogOpen(false);
        fetchData();
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deletingTeam) return;

    const { error } = await supabase.from("teams").delete().eq("id", deletingTeam.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete team. It may have members.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Team deleted" });
      fetchData();
    }

    setDeleteDialogOpen(false);
    setDeletingTeam(null);
  };

  if (roleLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage teams within clubs</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTeam ? "Edit Team" : "Add Team"}</DialogTitle>
              <DialogDescription>
                {editingTeam ? "Update the team details" : "Create a new team"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="club">Club *</Label>
                <Select
                  value={formData.club_id}
                  onValueChange={(value) => setFormData({ ...formData, club_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubs.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., U16 Boys A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age_group">Age Group</Label>
                  <Input
                    id="age_group"
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                    placeholder="e.g., U16"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    placeholder="e.g., Premier"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingTeam ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label>Association:</Label>
          <Select value={filterAssociation} onValueChange={setFilterAssociation}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {associations.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>Club:</Label>
          <Select value={filterClub} onValueChange={setFilterClub}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filteredClubsForDropdown.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Teams
          </CardTitle>
          <CardDescription>{filteredTeams.length} team(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No teams found. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Age Group</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.clubs?.name || "-"}</TableCell>
                    <TableCell>{team.age_group || "-"}</TableCell>
                    <TableCell>{team.division || "-"}</TableCell>
                    <TableCell>{team.gender || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(team)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingTeam(team);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingTeam?.name}" and remove all team memberships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamsManagement;
