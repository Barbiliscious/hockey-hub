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
import { Plus, Pencil, Trash2, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import type { Database } from "@/integrations/supabase/types";

type Club = Database["public"]["Tables"]["clubs"]["Row"];
type Association = Database["public"]["Tables"]["associations"]["Row"];

interface ClubWithAssociation extends Club {
  associations: { name: string } | null;
}

const ClubsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: roleLoading, isAdmin } = useUserRole();
  
  const [clubs, setClubs] = useState<ClubWithAssociation[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAssociation, setFilterAssociation] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<ClubWithAssociation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingClub, setDeletingClub] = useState<ClubWithAssociation | null>(null);
  const [formData, setFormData] = useState({ name: "", abbreviation: "", logo_url: "", association_id: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin()) {
      navigate("/dashboard");
    }
  }, [roleLoading, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);

    const [clubsRes, associationsRes] = await Promise.all([
      supabase
        .from("clubs")
        .select("*, associations:association_id(name)")
        .order("name"),
      supabase.from("associations").select("*").order("name"),
    ]);

    if (clubsRes.error) {
      toast({ title: "Error", description: "Failed to load clubs", variant: "destructive" });
    } else {
      setClubs(clubsRes.data || []);
    }

    if (!associationsRes.error) {
      setAssociations(associationsRes.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchData();
    }
  }, [isAdmin]);

  const filteredClubs = filterAssociation === "all"
    ? clubs
    : clubs.filter((c) => c.association_id === filterAssociation);

  const handleOpenDialog = (club?: ClubWithAssociation) => {
    if (club) {
      setEditingClub(club);
      setFormData({
        name: club.name,
        abbreviation: club.abbreviation || "",
        logo_url: club.logo_url || "",
        association_id: club.association_id,
      });
    } else {
      setEditingClub(null);
      setFormData({ name: "", abbreviation: "", logo_url: "", association_id: "" });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.association_id) {
      toast({ title: "Error", description: "Name and Association are required", variant: "destructive" });
      return;
    }

    setSaving(true);

    if (editingClub) {
      const { error } = await supabase
        .from("clubs")
        .update({
          name: formData.name.trim(),
          abbreviation: formData.abbreviation.trim() || null,
          logo_url: formData.logo_url.trim() || null,
          association_id: formData.association_id,
        })
        .eq("id", editingClub.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update club", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Club updated" });
        setDialogOpen(false);
        fetchData();
      }
    } else {
      const { error } = await supabase
        .from("clubs")
        .insert({
          name: formData.name.trim(),
          abbreviation: formData.abbreviation.trim() || null,
          logo_url: formData.logo_url.trim() || null,
          association_id: formData.association_id,
        });

      if (error) {
        toast({ title: "Error", description: "Failed to create club", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Club created" });
        setDialogOpen(false);
        fetchData();
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deletingClub) return;

    const { error } = await supabase.from("clubs").delete().eq("id", deletingClub.id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete club. It may have teams.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Club deleted" });
      fetchData();
    }

    setDeleteDialogOpen(false);
    setDeletingClub(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
          <p className="text-muted-foreground">Manage clubs within associations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Club
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingClub ? "Edit Club" : "Add Club"}</DialogTitle>
              <DialogDescription>
                {editingClub ? "Update the club details" : "Create a new club"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="association">Association *</Label>
                <Select
                  value={formData.association_id}
                  onValueChange={(value) => setFormData({ ...formData, association_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select association" />
                  </SelectTrigger>
                  <SelectContent>
                    {associations.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
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
                  placeholder="e.g., Melbourne Hockey Club"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abbreviation">Abbreviation</Label>
                <Input
                  id="abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                  placeholder="e.g., MHC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingClub ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label>Filter by Association:</Label>
        <Select value={filterAssociation} onValueChange={setFilterAssociation}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Associations</SelectItem>
            {associations.map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Clubs
          </CardTitle>
          <CardDescription>{filteredClubs.length} club(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No clubs yet. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Association</TableHead>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>{club.associations?.name || "-"}</TableCell>
                    <TableCell>{club.abbreviation || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(club)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingClub(club);
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
            <AlertDialogTitle>Delete Club?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deletingClub?.name}".
              All teams under this club must be deleted first.
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

export default ClubsManagement;
