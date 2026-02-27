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
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Field background image */}
        <div
          className="absolute inset-0 z-0 bg-primary"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)",
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-primary/40" />

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
