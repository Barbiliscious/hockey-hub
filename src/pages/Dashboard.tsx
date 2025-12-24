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
} from "lucide-react";
import { mockGames, mockPlayers } from "@/lib/mockData";

const Dashboard = () => {
  const upcomingGames = mockGames
    .filter((game) => game.isClubTeamGame && game.status === "SCHEDULED")
    .slice(0, 3);

  const nextGame = upcomingGames[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            WELCOME BACK, JAMES
          </h1>
          <p className="text-muted-foreground mt-1">
            Grampians Hockey Club • Div2 Men
          </p>
        </div>
        <Badge variant="player" className="w-fit">
          Player
        </Badge>
      </div>

      {/* Next Game Card */}
      {nextGame && (
        <Card variant="gradient" className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Next Match
                </p>
                <Badge variant="scheduled">{nextGame.grade}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {new Date(nextGame.date).toLocaleDateString("en-AU", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="font-semibold text-foreground">
                  {nextGame.startTime}
                </p>
              </div>
            </div>

            <div className="text-center py-6">
              <p className="font-display text-2xl md:text-3xl text-foreground">
                {nextGame.homeTeamName}
              </p>
              <p className="text-muted-foreground text-lg my-2">vs</p>
              <p className="font-display text-2xl md:text-3xl text-foreground">
                {nextGame.awayTeamName}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {nextGame.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {nextGame.startTime}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/games/${nextGame.id}`} className="flex-1">
                <Button variant="default" className="w-full">
                  View Game Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="success" className="flex-1">
                Mark Available
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Calendar className="h-5 w-5" />}
          label="Upcoming Games"
          value={upcomingGames.length.toString()}
        />
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          label="Team Members"
          value={mockPlayers.length.toString()}
        />
        <StatsCard
          icon={<Trophy className="h-5 w-5" />}
          label="Season Goals"
          value="12"
        />
        <StatsCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Games Played"
          value="8"
        />
      </div>

      {/* Upcoming Games List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-foreground">
            UPCOMING GAMES
          </h2>
          <Link to="/games">
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {upcomingGames.map((game, index) => (
            <GameListItem key={game.id} game={game} index={index} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-display text-xl text-foreground mb-4">
          RECENT ACTIVITY
        </h2>
        <Card variant="default">
          <CardContent className="p-4">
            <div className="space-y-4">
              <ActivityItem
                icon="🏒"
                title="Team Selection Updated"
                description="You've been selected as a starter for the upcoming game."
                time="2 hours ago"
              />
              <ActivityItem
                icon="📊"
                title="Stats Published"
                description="Match stats from the last game are now available."
                time="1 day ago"
              />
              <ActivityItem
                icon="💬"
                title="New Message"
                description="Coach posted in the club chat."
                time="2 days ago"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatsCard = ({ icon, label, value }: StatsCardProps) => (
  <Card variant="interactive">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-display text-2xl text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface GameListItemProps {
  game: (typeof mockGames)[0];
  index: number;
}

const GameListItem = ({ game, index }: GameListItemProps) => (
  <Link to={`/games/${game.id}`}>
    <Card
      variant="game"
      className="animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center min-w-[50px]">
              <p className="text-xs text-muted-foreground">
                {new Date(game.date).toLocaleDateString("en-AU", {
                  weekday: "short",
                })}
              </p>
              <p className="font-display text-lg text-foreground">
                {new Date(game.date).getDate()}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(game.date).toLocaleDateString("en-AU", {
                  month: "short",
                })}
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {game.homeTeamName} vs {game.awayTeamName}
              </p>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {game.startTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {game.location}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="available">Available</Badge>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

interface ActivityItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ icon, title, description, time }: ActivityItemProps) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-foreground text-sm">{title}</p>
      <p className="text-muted-foreground text-sm truncate">{description}</p>
    </div>
    <p className="text-xs text-muted-foreground whitespace-nowrap">{time}</p>
  </div>
);

export default Dashboard;
