import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Trophy,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
const Landing = () => {
  // Hockey pitch SVG constants (matching HockeyPitch.tsx)
  const PADDING = 50;
  const FIELD_X = PADDING;
  const FIELD_Y = PADDING;
  const FIELD_W = 1000 - PADDING * 2;
  const FIELD_H = 620 - PADDING * 2;
  const FIELD_R = FIELD_X + FIELD_W;
  const FIELD_B = FIELD_Y + FIELD_H;
  const CENTER_X_LINE = FIELD_X + FIELD_W / 2;
  const LINE_23_LEFT = FIELD_X + FIELD_W * 0.25;
  const LINE_23_RIGHT = FIELD_X + FIELD_W * 0.75;
  const MID_Y = FIELD_Y + FIELD_H / 2;
  const D_RADIUS = 100;
  const DOT_ARC_RADIUS = 130;
  const GOAL_W = 20;
  const GOAL_H = 40;
  const TICK_LEN = 6;
  const TICK_SPACING = 30;
  const penSpotOffset = 50;

  const ticks: React.ReactNode[] = [];
  for (let x = FIELD_X + TICK_SPACING; x < FIELD_R; x += TICK_SPACING) {
    ticks.push(
      <line key={`tt-${x}`} x1={x} y1={FIELD_Y} x2={x} y2={FIELD_Y - TICK_LEN} stroke="white" strokeWidth="1.5" />,
      <line key={`tb-${x}`} x1={x} y1={FIELD_B} x2={x} y2={FIELD_B + TICK_LEN} stroke="white" strokeWidth="1.5" />
    );
  }
  for (let y = FIELD_Y + TICK_SPACING; y < FIELD_B; y += TICK_SPACING) {
    ticks.push(
      <line key={`tl-${y}`} x1={FIELD_X} y1={y} x2={FIELD_X - TICK_LEN} y2={y} stroke="white" strokeWidth="1.5" />,
      <line key={`tr-${y}`} x1={FIELD_R} y1={y} x2={FIELD_R + TICK_LEN} y2={y} stroke="white" strokeWidth="1.5" />
    );
  }

  const leftD = `M ${FIELD_X} ${MID_Y - D_RADIUS} A ${D_RADIUS} ${D_RADIUS} 0 0 1 ${FIELD_X} ${MID_Y + D_RADIUS}`;
  const rightD = `M ${FIELD_R} ${MID_Y - D_RADIUS} A ${D_RADIUS} ${D_RADIUS} 0 0 0 ${FIELD_R} ${MID_Y + D_RADIUS}`;
  const leftDotArc = `M ${FIELD_X} ${MID_Y - DOT_ARC_RADIUS} A ${DOT_ARC_RADIUS} ${DOT_ARC_RADIUS} 0 0 1 ${FIELD_X} ${MID_Y + DOT_ARC_RADIUS}`;
  const rightDotArc = `M ${FIELD_R} ${MID_Y - DOT_ARC_RADIUS} A ${DOT_ARC_RADIUS} ${DOT_ARC_RADIUS} 0 0 0 ${FIELD_R} ${MID_Y + DOT_ARC_RADIUS}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* SVG Hockey Pitch Background */}
        <svg
          viewBox="0 0 1000 620"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full z-0"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect x="0" y="0" width="1000" height="620" fill="#1a3a6b" />
          <rect x={FIELD_X} y={FIELD_Y} width={FIELD_W} height={FIELD_H} fill="#2d8a4e" />
          <rect x={FIELD_X + 4} y={FIELD_Y + 4} width={FIELD_W - 8} height={FIELD_H - 8} fill="none" stroke="white" strokeWidth="2.5" />
          <line x1={CENTER_X_LINE} y1={FIELD_Y + 4} x2={CENTER_X_LINE} y2={FIELD_B - 4} stroke="white" strokeWidth="2" />
          <line x1={LINE_23_LEFT} y1={FIELD_Y + 4} x2={LINE_23_LEFT} y2={FIELD_B - 4} stroke="white" strokeWidth="1.5" />
          <line x1={LINE_23_RIGHT} y1={FIELD_Y + 4} x2={LINE_23_RIGHT} y2={FIELD_B - 4} stroke="white" strokeWidth="1.5" />
          <path d={leftD} fill="none" stroke="white" strokeWidth="2.5" />
          <path d={rightD} fill="none" stroke="white" strokeWidth="2.5" />
          <path d={leftDotArc} fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 8" />
          <path d={rightDotArc} fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 8" />
          <circle cx={FIELD_X + penSpotOffset} cy={MID_Y} r="4" fill="white" />
          <circle cx={FIELD_R - penSpotOffset} cy={MID_Y} r="4" fill="white" />
          <rect x={FIELD_X - GOAL_W} y={MID_Y - GOAL_H / 2} width={GOAL_W} height={GOAL_H} fill="#1a3a6b" stroke="white" strokeWidth="2" />
          <rect x={FIELD_X - GOAL_W - 4} y={MID_Y - GOAL_H / 2 - 3} width={6} height={8} fill="#b0b0b0" />
          <rect x={FIELD_X - GOAL_W - 4} y={MID_Y + GOAL_H / 2 - 5} width={6} height={8} fill="#b0b0b0" />
          <rect x={FIELD_R} y={MID_Y - GOAL_H / 2} width={GOAL_W} height={GOAL_H} fill="#1a3a6b" stroke="white" strokeWidth="2" />
          <rect x={FIELD_R + GOAL_W - 2} y={MID_Y - GOAL_H / 2 - 3} width={6} height={8} fill="#b0b0b0" />
          <rect x={FIELD_R + GOAL_W - 2} y={MID_Y + GOAL_H / 2 - 5} width={6} height={8} fill="#b0b0b0" />
          {ticks}
        </svg>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-primary/60" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
              Team Management Made Simple
            </Badge>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6 tracking-tight animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            GRAMPIANS HOCKEY
          </h1>

          <p
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Manage your team's fixtures, availability, selection, and more —
            all in one place. Built for players, coaches, and administrators.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/login">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Sign In
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="glass" size="xl" className="w-full sm:w-auto text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              EVERYTHING YOUR TEAM NEEDS
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Streamline your hockey club management with powerful features
              designed for the modern game.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Fixtures & Availability"
              description="View upcoming games, mark your availability, and never miss a match."
              delay="0s"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Team Selection"
              description="Coaches can easily select teams and assign positions on an interactive pitch view."
              delay="0.1s"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Stats & Voting"
              description="Track goals, cards, and vote for best performers after each game."
              delay="0.2s"
            />
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8" />}
              title="Club Chat"
              description="Stay connected with your teammates through integrated club messaging."
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mb-6">
            READY TO GET STARTED?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join your team today and experience seamless hockey management.
          </p>
          <Link to="/signup">
            <Button variant="hero" size="xl">
              Create Your Account
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 Grampians Hockey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <div
    className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="w-14 h-14 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Landing;
