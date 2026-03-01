import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ClipboardList,
  Users,
  UserCog,
  Settings,
  Building2,
  Shield,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTestRole } from "@/contexts/TestRoleContext";
import { useTeamContext } from "@/contexts/TeamContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminScope } from "@/hooks/useAdminScope";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/mockData";

// Base nav items for all users
const baseNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/games", label: "Fixtures", icon: Calendar },
  { path: "/roster", label: "Statistics", icon: BarChart3 },
  { path: "/chat", label: "Chat", icon: MessageCircle },
];

const coachNavItems = [
  { path: "/lineup", label: "Lineups", icon: ClipboardList },
  { path: "/team-management", label: "Team", icon: Users },
];

const clubAdminNavItems = [
  { path: "/club-management", label: "Club", icon: Building2 },
  { path: "/club-teams", label: "Teams", icon: Users },
];

const associationAdminNavItems = [
  { path: "/association", label: "Association", icon: Building2 },
  { path: "/clubs", label: "Clubs", icon: Shield },
  { path: "/user-management", label: "Users", icon: UserCog },
];

const systemAdminNavItems = [
  { path: "/all-associations", label: "All Associations", icon: Globe },
  { path: "/settings", label: "System Settings", icon: Settings },
];

const getNavItems = (role: Role) => {
  let items = [...baseNavItems];
  if (["COACH", "CLUB_ADMIN", "ASSOCIATION_ADMIN", "SYSTEM_ADMIN"].includes(role)) {
    items = [...items, ...coachNavItems];
  }
  if (["CLUB_ADMIN", "ASSOCIATION_ADMIN", "SYSTEM_ADMIN"].includes(role)) {
    items = [...items, ...clubAdminNavItems];
  }
  if (["ASSOCIATION_ADMIN", "SYSTEM_ADMIN"].includes(role)) {
    items = [...items, ...associationAdminNavItems];
  }
  if (role === "SYSTEM_ADMIN") {
    items = [...items, ...systemAdminNavItems];
  }
  return items;
};

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testRole } = useTestRole();
  const { user } = useAuth();
  const { isAnyAdmin } = useAdminScope();
  const {
    associations,
    selectedAssociationId,
    selectedClubId,
    selectedTeamId,
    setSelectedAssociationId,
    setSelectedClubId,
    setSelectedTeamId,
    filteredClubs,
    filteredTeams,
    selectedAssociation,
  } = useTeamContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssociationPopoverOpen, setIsAssociationPopoverOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from DB
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setNotifications(data || []);
    };
    fetchNotifications();
  }, [user]);

  const handleAssociationChange = (associationId: string) => {
    setSelectedAssociationId(associationId);
    setIsAssociationPopoverOpen(false);
  };

  // Build nav items: base + admin link if user has any admin/manager/coach role
  const navItems = [
    ...getNavItems(testRole),
    ...(isAnyAdmin ? [{ path: "/admin", label: "Admin", icon: ShieldCheck }] : []),
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left: Association Logo & Selectors */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Association Logo with Popover */}
            <Popover open={isAssociationPopoverOpen} onOpenChange={setIsAssociationPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary-foreground/20 hover:border-primary-foreground/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/50">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={selectedAssociation?.logo_url || undefined}
                      alt={selectedAssociation?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-none bg-accent text-accent-foreground text-xs font-semibold">
                      {selectedAssociation?.abbreviation || selectedAssociation?.name?.substring(0, 2).toUpperCase() || "HA"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2 bg-background border-border" align="start">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Select Association
                  </p>
                  {associations.map((assoc) => (
                    <button
                      key={assoc.id}
                      onClick={() => handleAssociationChange(assoc.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                        selectedAssociationId === assoc.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={assoc.logo_url || undefined} alt={assoc.name} className="object-cover" />
                        <AvatarFallback className="text-xs">
                          {assoc.abbreviation || assoc.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{assoc.name}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Club Selector */}
            {filteredClubs.length > 0 && (
              <Select value={selectedClubId} onValueChange={setSelectedClubId}>
                <SelectTrigger className="w-[180px] lg:w-[200px] bg-accent text-accent-foreground border-0 font-medium">
                  <SelectValue placeholder="Select Club" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {filteredClubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Team Selector */}
            {filteredTeams.length > 0 && (
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-[140px] lg:w-[180px] bg-accent text-accent-foreground border-0 font-medium">
                  <SelectValue placeholder="Select Team" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {filteredTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Right: Role Badge, Notifications & User */}
          <div className="flex items-center gap-3">
            {testRole !== "PLAYER" && (
              <Badge className="bg-amber-500 text-amber-950 text-xs hidden sm:flex">
                Testing: {testRole.replace(/_/g, " ")}
              </Badge>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-background border-border" align="end">
                <div className="p-3 border-b border-border">
                  <h4 className="font-semibold text-foreground">Notifications</h4>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer",
                          !notification.read && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🔔</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.created_at).toLocaleDateString("en-AU", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:ring-2 hover:ring-primary-foreground/50 transition-all cursor-pointer">
                <User className="h-5 w-5 text-accent-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 min-h-[calc(100vh-3.5rem)] bg-accent border-r border-border">
          <nav className="flex-1 py-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/games" && location.pathname.startsWith("/games"));
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg text-sm font-medium transition-all border-l-4",
                      isActive
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "text-accent-foreground hover:bg-accent-foreground/10 border-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-accent-foreground hover:bg-accent-foreground/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-14 bottom-0 w-64 bg-accent animate-slide-in-right flex flex-col">
              <nav className="flex-1 py-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg text-sm font-medium transition-all border-l-4",
                          isActive
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : "text-accent-foreground hover:bg-accent-foreground/10 border-transparent"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-accent-foreground hover:bg-accent-foreground/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] p-4 lg:p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
        <div className="flex justify-around py-2">
          {baseNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="h-16 lg:h-0" />
    </div>
  );
};

export default AppLayout;
