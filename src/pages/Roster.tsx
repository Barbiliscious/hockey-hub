import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Filter } from "lucide-react";
import { mockPlayers, positions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const Roster = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const filteredPlayers = mockPlayers.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition
      ? player.position === selectedPosition
      : true;
    return matchesSearch && matchesPosition;
  });

  const positionGroups = {
    Strikers: ["Left Wing", "Centre Forward", "Right Wing"],
    Midfielders: ["Left Inside", "Centre Half", "Right Inside"],
    Backs: ["Left Half", "Fullback", "Right Half"],
    Goalkeeper: ["Goalkeeper"],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          TEAM ROSTER
        </h1>
        <p className="text-muted-foreground mt-1">
          Div2 Men • {mockPlayers.length} players
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedPosition === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPosition(null)}
          >
            All
          </Button>
          {Object.keys(positionGroups).map((group) => (
            <Button
              key={group}
              variant={
                positionGroups[group as keyof typeof positionGroups].includes(
                  selectedPosition || ""
                )
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setSelectedPosition(
                  positionGroups[group as keyof typeof positionGroups][0]
                )
              }
            >
              {group}
            </Button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers.map((player, index) => (
          <Card
            key={player.id}
            variant="interactive"
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl">
                  {player.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {player.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {player.position}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="player" className="text-xs">
                      Player
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <Card variant="ghost" className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No players found.</p>
        </Card>
      )}
    </div>
  );
};

export default Roster;
