import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Users, Shield, Trophy, ArrowRight, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole, getRoleDisplayName, getRoleBadgeColor } from "@/hooks/useUserRole";

interface Stats {
  associations: number;
  clubs: number;
  teams: number;
  users: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { highestRole, loading: roleLoading, isSuperAdmin, isAdmin } = useUserRole();
  const [stats, setStats] = useState<Stats>({ associations: 0, clubs: 0, teams: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (!roleLoading && !isAdmin()) {
      navigate("/dashboard");
    }
  }, [roleLoading, isAdmin, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const [associationsRes, clubsRes, teamsRes, usersRes] = await Promise.all([
        supabase.from("associations").select("id", { count: "exact", head: true }),
        supabase.from("clubs").select("id", { count: "exact", head: true }),
        supabase.from("teams").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        associations: associationsRes.count || 0,
        clubs: clubsRes.count || 0,
        teams: teamsRes.count || 0,
        users: usersRes.count || 0,
      });
      setLoading(false);
    };

    if (isAdmin()) {
      fetchStats();
    }
  }, [isAdmin]);

  if (roleLoading) {
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

  const statCards = [
    {
      title: "Associations",
      value: stats.associations,
      icon: Building2,
      href: "/admin/associations",
      description: "Manage associations",
      color: "text-blue-600",
    },
    {
      title: "Clubs",
      value: stats.clubs,
      icon: Shield,
      href: "/admin/clubs",
      description: "Manage clubs",
      color: "text-green-600",
    },
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
        {highestRole && (
          <Badge className={getRoleBadgeColor(highestRole)}>
            <Crown className="mr-1 h-3 w-3" />
            {getRoleDisplayName(highestRole)}
          </Badge>
        )}
      </div>

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
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" asChild className="h-auto py-4 flex-col">
            <Link to="/admin/associations">
              <Building2 className="mb-2 h-6 w-6" />
              <span>Add Association</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex-col">
            <Link to="/admin/clubs">
              <Shield className="mb-2 h-6 w-6" />
              <span>Add Club</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto py-4 flex-col">
            <Link to="/admin/teams">
              <Trophy className="mb-2 h-6 w-6" />
              <span>Add Team</span>
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
