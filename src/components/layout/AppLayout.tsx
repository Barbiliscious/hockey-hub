import { useState } from "react";
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
  LayoutDashboard,
  Calendar,
  BarChart3,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from "lucide-react";
import { mockAssociations, mockClubs, mockTeams } from "@/lib/mockData";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/games", label: "Fixtures", icon: Calendar },
  { path: "/roster", label: "Statistics", icon: BarChart3 },
  { path: "/chat", label: "Chat", icon: MessageCircle },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState(mockAssociations[0]?.id || "");
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]?.id || "");

  // Mock user data
  const user = {
    name: "James Wilson",
    initials: "JW",
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left: Association & Team Selectors */}
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

            {/* Association Selector */}
            <Select value={selectedAssociation} onValueChange={setSelectedAssociation}>
              <SelectTrigger className="w-[180px] bg-accent text-accent-foreground border-0 font-medium">
                <SelectValue placeholder="Association" />
              </SelectTrigger>
              <SelectContent>
                {mockAssociations.map((assoc) => (
                  <SelectItem key={assoc.id} value={assoc.id}>
                    {assoc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Team Selector */}
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px] bg-accent text-accent-foreground border-0 font-medium">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                {mockTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right: Notifications & User */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <User className="h-5 w-5 text-accent-foreground" />
            </div>
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
            <aside className="absolute left-0 top-14 bottom-0 w-64 bg-accent animate-slide-in-right">
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
          {navItems.map((item) => {
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
