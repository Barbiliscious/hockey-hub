import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Home", icon: LayoutDashboard },
  { path: "/games", label: "Games", icon: Calendar },
  { path: "/roster", label: "Roster", icon: Users },
  { path: "/chat", label: "Chat", icon: MessageCircle },
  { path: "/profile", label: "Profile", icon: User },
];

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user data
  const user = {
    name: "James Wilson",
    email: "james@example.com",
    role: "PLAYER" as const,
    club: "Grampians Hockey Club",
    team: "Div2 Men",
    initials: "JW",
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header Bar - Blue Gradient */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary to-blue-500">
        <div className="px-4 lg:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="font-display text-white text-xl">G</span>
              </div>
              <span className="font-display text-xl text-white tracking-wide hidden sm:block">
                GRAMPIANS HOCKEY
              </span>
            </Link>

            {/* Right side - User info & mobile toggle */}
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <Badge className="bg-white/20 text-white border-0 hidden sm:flex">
                {user.role}
              </Badge>

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <span className="text-sm font-semibold text-white">
                    {user.initials}
                  </span>
                </div>
                <span className="text-sm font-medium text-white hidden sm:block">
                  {user.name}
                </span>
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-3.5rem)] bg-card border-r border-border">
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === "/games" && location.pathname.startsWith("/games"));
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Logout at bottom */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Log out
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
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card animate-slide-in-right">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.team}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
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
