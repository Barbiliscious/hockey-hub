import { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  mockAssociations,
  mockClubs,
  mockTeams,
  currentUser,
  mockNotifications,
  getClubsByAssociation,
  getTeamsByClub,
  type Role,
} from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTestRole } from "@/contexts/TestRoleContext";

// Base nav items for all users
const baseNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/games", label: "Fixtures", icon: Calendar },
  { path: "/roster", label: "Statistics", icon: BarChart3 },
  { path: "/chat", label: "Chat", icon: MessageCircle },
];

// Coach-only nav items
const coachNavItems = [
  { path: "/lineup", label: "Lineups", icon: ClipboardList },
  { path: "/team-management", label: "Team", icon: Users },
];

// Club Admin nav items
const clubAdminNavItems = [
  { path: "/club-management", label: "Club", icon: Building2 },
  { path: "/club-teams", label: "Teams", icon: Users },
];

// Association Admin nav items
const associationAdminNavItems = [
  { path: "/association", label: "Association", icon: Building2 },
  { path: "/clubs", label: "Clubs", icon: Shield },
  { path: "/user-management", label: "Users", icon: UserCog },
];

// System Admin nav items
const systemAdminNavItems = [
  { path: "/all-associations", label: "All Associations", icon: Globe },
  { path: "/settings", label: "System Settings", icon: Settings },
];

// Get nav items based on user role (5-tier navigation)
const getNavItems = (role: Role) => {
  let items = [...baseNavItems];
  
  // Coach and above see coaching tools
  if (["COACH", "CLUB_ADMIN", "ASSOCIATION_ADMIN", "SYSTEM_ADMIN"].includes(role)) {
    items = [...items, ...coachNavItems];
  }
  
  // Club Admin and above see club management
  if (["CLUB_ADMIN", "ASSOCIATION_ADMIN", "SYSTEM_ADMIN"].includes(role)) {
    items = [...items, ...clubAdminNavItems];
  }
  
  // Association Admin and above see association management
  if (["ASSOCIATION_ADMIN", "SYSTEM_ADMIN"].includes(role)) {
    items = [...items, ...associationAdminNavItems];
  }
  
  // System Admin only
  if (role === "SYSTEM_ADMIN") {
    items = [...items, ...systemAdminNavItems];
  }
  
  return items;
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testRole } = useTestRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssociationPopoverOpen, setIsAssociationPopoverOpen] = useState(false);
  
  // Cascading selectors state
  const [selectedAssociation, setSelectedAssociation] = useState(mockAssociations[0]?.id || "");
  const [selectedClub, setSelectedClub] = useState(() => {
    const clubs = getClubsByAssociation(mockAssociations[0]?.id || "");
    return clubs[0]?.id || "";
  });
  const [selectedTeam, setSelectedTeam] = useState(() => {
    const clubs = getClubsByAssociation(mockAssociations[0]?.id || "");
    const teams = getTeamsByClub(clubs[0]?.id || "");
    return teams[0]?.id || "";
  });

  // Derived data for cascading dropdowns
  const filteredClubs = useMemo(() => {
    return getClubsByAssociation(selectedAssociation);
  }, [selectedAssociation]);

  const filteredTeams = useMemo(() => {
    return getTeamsByClub(selectedClub);
  }, [selectedClub]);

  const selectedAssociationData = useMemo(() => {
    return mockAssociations.find((a) => a.id === selectedAssociation);
  }, [selectedAssociation]);

  // Handle association change - reset club and team
  const handleAssociationChange = (associationId: string) => {
    setSelectedAssociation(associationId);
    setIsAssociationPopoverOpen(false);
    
    const clubs = getClubsByAssociation(associationId);
    const newClubId = clubs[0]?.id || "";
    setSelectedClub(newClubId);
    
    const teams = getTeamsByClub(newClubId);
    setSelectedTeam(teams[0]?.id || "");
  };

  // Handle club change - reset team
  const handleClubChange = (clubId: string) => {
    setSelectedClub(clubId);
    const teams = getTeamsByClub(clubId);
    setSelectedTeam(teams[0]?.id || "");
  };

  // Get user role from test context
  const navItems = getNavItems(testRole);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left: Association Logo & Selectors */}
          <div className="flex items-center gap-2">
            {/* Mobile menu toggle */}
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
                      src={selectedAssociationData?.logo} 
                      alt={selectedAssociationData?.name} 
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-none bg-accent text-accent-foreground text-xs font-semibold">
                      {selectedAssociationData?.name?.substring(0, 2).toUpperCase() || "HA"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2 bg-background border-border" align="start">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Select Association
                  </p>
                  {mockAssociations.map((assoc) => (
                    <button
                      key={assoc.id}
                      onClick={() => handleAssociationChange(assoc.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                        selectedAssociation === assoc.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={assoc.logo} alt={assoc.name} className="object-cover" />
                        <AvatarFallback className="text-xs">
                          {assoc.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{assoc.name}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Club Selector */}
            <Select value={selectedClub} onValueChange={handleClubChange}>
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

            {/* Team Selector */}
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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
          </div>

          {/* Right: Role Badge, Notifications & User */}
          <div className="flex items-center gap-3">
            {/* Test Role Indicator */}
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
                  {mockNotifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No notifications</p>
                  ) : (
                    mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer",
                          !notification.read && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">
                            {notification.type === "AVAILABILITY_REMINDER" && "🔔"}
                            {notification.type === "COACH_REMINDER" && "📢"}
                            {notification.type === "UNREAD_CHAT" && "💬"}
                            {notification.type === "TEAM_INVITE" && "📩"}
                            {notification.type === "FILL_IN_INVITE" && "⚡"}
                            {notification.type === "AVAILABILITY_CHANGE" && "🔄"}
                            {notification.type === "FILL_IN_DECLINED" && "❌"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.date).toLocaleDateString("en-AU", {
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
            
            {/* User Profile Button */}
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

          {/* Logout at bottom */}
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
