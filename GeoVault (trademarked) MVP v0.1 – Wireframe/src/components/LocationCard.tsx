import { MapPin, Share2, Trash2, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Location } from "../types/location";
import { toast } from "sonner@2.0.3";

interface LocationCardProps {
  location: Location;
  onDelete: (id: string) => void;
  onNavigate: (location: Location) => void;
}

export function LocationCard({ location, onDelete, onNavigate }: LocationCardProps) {
  const handleShare = async () => {
    const shareText = `${location.name}\nCoordinates: ${location.lat}, ${location.lng}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: location.name,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Coordinates copied to clipboard!");
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share location");
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-4 bg-card border-border hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="truncate">{location.name}</h3>
              <p className="text-sm text-muted-foreground">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Added {formatDate(location.timestamp)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onNavigate(location)}
            title="View on map"
          >
            <Navigation className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleShare}
            title="Share location"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(location.id)}
            title="Delete location"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
