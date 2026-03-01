import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Users, Shield, Trophy, ArrowRight, Crown, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminScope } from "@/hooks/useAdminScope";
import { getRoleDisplayName, getRoleBadgeColor } from "@/hooks/useUserRole";

interface Stats {
  associations: number;
  clubs: number;
  teams: number;
  users: number;
  pendingMemberships: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loading: scopeLoading, isSuperAdmin, isAnyAdmin, highestScopedRole, scopedAssociationIds, scopedClubIds, scopedTeamIds } = useAdminScope();
  const [stats, setStats] = useState<Stats>({ associations: 0, clubs: 0, teams: 0, users: 0, pendingMemberships: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scopeLoading && !isAnyAdmin) {
      navigate("/dashboard");
    }
  }, [scopeLoading, isAnyAdmin, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAnyAdmin) return;
      setLoading(true);

      if (isSuperAdmin) {
        const [assocRes, clubsRes, teamsRes, usersRes, pendingRes] = await Promise.all([
          supabase.from("associations").select("id", { count: "exact", head: true }),
          supabase.from("clubs").select("id", { count: "exact", head: true }),
          supabase.from("teams").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("team_memberships").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
        ]);
        setStats({
          associations: assocRes.count || 0,
          clubs: clubsRes.count || 0,
          teams: teamsRes.count || 0,
          users: usersRes.count || 0,
          pendingMemberships: pendingRes.count || 0,
        });
      } else {
        // Scoped counts
        let assocCount = 0, clubsCount = 0, teamsCount = 0, usersCount = 0, pendingCount = 0;

        if (scopedAssociationIds.length > 0) {
          const { count } = await supabase.from("associations").select("id", { count: "exact", head: true }).in("id", scopedAssociationIds);
          assocCount = count || 0;
        }
        if (scopedClubIds.length > 0) {
          const { count } = await supabase.from("clubs").select("id", { count: "exact", head: true }).in("id", scopedClubIds);
          clubsCount = count || 0;
        }
        if (scopedTeamIds.length > 0) {
          const [teamsRes, usersRes, pendingRes] = await Promise.all([
            supabase.from("teams").select("id", { count: "exact", head: true }).in("id", scopedTeamIds),
            supabase.from("team_memberships").select("user_id", { count: "exact", head: true }).in("team_id", scopedTeamIds),
            supabase.from("team_memberships").select("id", { count: "exact", head: true }).in("team_id", scopedTeamIds).eq("status", "PENDING"),
          ]);
          teamsCount = teamsRes.count || 0;
          usersCount = usersRes.count || 0;
          pendingCount = pendingRes.count || 0;
        }

        setStats({
          associations: assocCount,
          clubs: clubsCount,
          teams: teamsCount,
          users: usersCount,
          pendingMemberships: pendingCount,
        });
      }

      setLoading(false);
    };

    if (!scopeLoading && isAnyAdmin) {
      fetchStats();
    }
  }, [scopeLoading, isAnyAdmin, isSuperAdmin, scopedAssociationIds, scopedClubIds, scopedTeamIds]);

  if (scopeLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Determine which cards to show based on role hierarchy
  const showAssociations = isSuperAdmin || scopedAssociationIds.length > 0;
  const showClubs = isSuperAdmin || scopedAssociationIds.length > 0 || scopedClubIds.length > 0;

  const statCards = [
    ...(showAssociations ? [{
      title: "Associations",
      value: stats.associations,
      icon: Building2,
      href: "/admin/associations",
      description: "Manage associations",
      color: "text-blue-600",
    }] : []),
    ...(showClubs ? [{
      title: "Clubs",
      value: stats.clubs,
      icon: Shield,
      href: "/admin/clubs",
      description: "Manage clubs",
      color: "text-green-600",
    }] : []),
    {
      title: "Teams",
      value: stats.teams,
      icon: Trophy,
      href: "/admin/teams",
      description: "Manage teams",
      color: "text-purple-600",
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      description: "Manage users & roles",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your organization's structure and users
          </p>
        </div>
        {highestScopedRole && (
          <Badge className={getRoleBadgeColor(highestScopedRole)}>
            <Crown className="mr-1 h-3 w-3" />
            {getRoleDisplayName(highestScopedRole)}
          </Badge>
        )}
      </div>

      {/* Pending Memberships Alert */}
      {stats.pendingMemberships > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-foreground">{stats.pendingMemberships} pending membership(s)</p>
                <p className="text-sm text-muted-foreground">Users waiting for approval</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/users">Review</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <Link to={stat.href}>
                <Button variant="link" className="p-0 h-auto mt-2">
                  {stat.description}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {showAssociations && (
            <Button variant="outline" asChild className="h-auto py-4 flex-col">
              <Link to="/admin/associations">
                <Building2 className="mb-2 h-6 w-6" />
                <span>Associations</span>
              </Link>
            </Button>
          )}
          {showClubs && (
            <Button variant="outline" asChild className="h-auto py-4 flex-col">
              <Link to="/admin/clubs">
                <Shield className="mb-2 h-6 w-6" />
                <span>Clubs</span>
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild className="h-auto py-4 flex-col">
            <Link to="/admin/teams">
              <Trophy className="mb-2 h-6 w-6" />
              <span>Teams</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex-col">
            <Link to="/admin/users">
              <Users className="mb-2 h-6 w-6" />
              <span>Manage Users</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
