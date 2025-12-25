import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Users,
  Trophy,
  TrendingUp,
  Play,
  CalendarPlus,
  Eye,
} from "lucide-react";
import { mockGames, mockPlayers } from "@/lib/mockData";

const Dashboard = () => {
  const upcomingGames = mockGames
    .filter((game) => game.isClubTeamGame && game.status === "SCHEDULED")
    .slice(0, 4);

  const nextGame = upcomingGames[0];

  // Mock user
  const user = {
    name: "James",
    team: "Div2 Men",
    club: "Grampians Hockey Club",
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Grid Layout like reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Welcome + Agenda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Good morning, {user.name}!
                </h1>
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-primary/20">
                  <span className="text-2xl font-bold text-primary">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Today's Agenda / Upcoming Games */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Your upcoming games:
                </h3>
                <div className="space-y-3">
                  {upcomingGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-foreground">
                          {game.homeTeamName} vs {game.awayTeamName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(game.date).toLocaleDateString("en-AU", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {game.startTime}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/games/${game.id}`}>
                          <Button size="sm" variant="default">
                            View
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          Set Availability
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Row - Calendar Preview + Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mini Calendar Preview */}
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Calendar</CardTitle>
                  <Link to="/games">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-primary font-medium">
                  {new Date().toLocaleDateString("en-AU", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                {/* Simple week view */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className="py-1 text-muted-foreground font-medium">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNum = i - 2; // offset for month start
                    const isToday = dayNum === new Date().getDate();
                    const hasGame = [28, 4].includes(dayNum);
                    return (
                      <div
                        key={i}
                        className={`py-1.5 rounded-full text-sm ${
                          dayNum < 1 || dayNum > 31
                            ? "text-transparent"
                            : isToday
                            ? "bg-primary text-primary-foreground font-semibold"
                            : hasGame
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stats / Insights */}
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Games this season</p>
                      <p className="text-sm text-muted-foreground">you played in</p>
                    </div>
                    <span className="text-4xl font-bold text-primary">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Goals scored</p>
                      <p className="text-sm text-muted-foreground">this season</p>
                    </div>
                    <span className="text-4xl font-bold text-primary">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Quick Actions + Activity */}
        <div className="space-y-4">
          {/* Quick Action Cards */}
          <QuickActionCard
            icon={<Play className="h-5 w-5" />}
            title="View Next Game"
            onClick={() => {}}
            to={nextGame ? `/games/${nextGame.id}` : "/games"}
          />
          <QuickActionCard
            icon={<Users className="h-5 w-5" />}
            title="View Team Roster"
            to="/roster"
          />
          <QuickActionCard
            icon={<CalendarPlus className="h-5 w-5" />}
            title="All Fixtures"
            to="/games"
          />

          {/* Recent Activity / Notifications */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <NotificationItem
                  avatar="C"
                  name="Coach"
                  message="posted lineup for Saturday"
                  highlight="Div2 vs Tigers"
                  actionLabel="View"
                />
                <NotificationItem
                  avatar="A"
                  name="Admin"
                  message="opened voting for"
                  highlight="Last week's game"
                  actionLabel="Vote"
                />
                <NotificationItem
                  avatar="T"
                  name="Team"
                  message="new message in"
                  highlight="Club Chat"
                  actionLabel="Open"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  to?: string;
}

const QuickActionCard = ({ icon, title, onClick, to }: QuickActionCardProps) => {
  const content = (
    <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer group">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <span className="font-medium text-foreground">{title}</span>
      </CardContent>
    </Card>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return <div onClick={onClick}>{content}</div>;
};

interface NotificationItemProps {
  avatar: string;
  name: string;
  message: string;
  highlight: string;
  actionLabel: string;
}

const NotificationItem = ({
  avatar,
  name,
  message,
  highlight,
  actionLabel,
}: NotificationItemProps) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
      {avatar}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm">
        <span className="font-medium">{name}</span>{" "}
        <span className="text-muted-foreground">{message}</span>{" "}
        <span className="text-primary font-medium">{highlight}</span>
      </p>
    </div>
    <Button size="sm" variant="default">
      {actionLabel}
    </Button>
  </div>
);

export default Dashboard;
