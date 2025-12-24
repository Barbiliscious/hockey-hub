import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogOut } from "lucide-react";

const Pending = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center" variant="elevated">
        <CardHeader className="pb-4">
          <div className="w-16 h-16 rounded-full bg-warning/15 text-warning mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Pending Approval</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your registration is being reviewed by your club or coach. You'll be
            notified once your account is approved.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-foreground mb-1">
              Requested to join:
            </p>
            <p className="text-sm text-muted-foreground">
              Grampians Hockey Club
            </p>
            <p className="text-sm text-muted-foreground">Div2 Men</p>
          </div>

          <p className="text-sm text-muted-foreground">
            This usually takes 24-48 hours. If you have any questions, please
            contact your club administrator.
          </p>

          <Link to="/" className="block">
            <Button variant="ghost" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pending;
