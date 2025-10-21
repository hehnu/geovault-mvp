import { useEffect, useRef, useState } from "react";
import { Location } from "../types/location";
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

interface MapViewProps {
  locations: Location[];
  center: [number, number];
  onMarkerClick: (location: Location) => void;
}

export function MapView({ locations, center, onMarkerClick }: MapViewProps) {
  const [zoom, setZoom] = useState(2);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    setMapCenter(center);
    // Auto-zoom when a new location is added
    if (locations.length > 0) {
      setZoom(10);
    }
  }, [center, locations.length]);

  // Convert lat/lng to tile coordinates for OpenStreetMap
  const getTileUrl = (lat: number, lng: number, z: number) => {
    const x = Math.floor(((lng + 180) / 360) * Math.pow(2, z));
    const y = Math.floor(
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
        Math.pow(2, z)
    );
    return { x, y, z };
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setZoom(2);
    setMapCenter([20, 0]);
  };

  // Calculate marker positions
  const getMarkerPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (1 - mercN / Math.PI) * 50;
    return { x, y };
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border shadow-lg bg-card relative">
      {/* Map iframe using OpenStreetMap */}
      <div className="w-full h-full relative">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1] - 10},${mapCenter[0] - 10},${mapCenter[1] + 10},${mapCenter[0] + 10}&layer=mapnik&marker=${mapCenter[0]},${mapCenter[1]}`}
          style={{ border: 0, width: "100%", height: "100%" }}
          title="Map"
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="shadow-lg bg-card hover:bg-accent"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="shadow-lg bg-card hover:bg-accent"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReset}
          className="shadow-lg bg-card hover:bg-accent"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Location Counter */}
      {locations.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-border z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {locations.length} {locations.length === 1 ? "location" : "locations"} pinned
            </span>
          </div>
        </div>
      )}

      {/* Legend for saved locations */}
      {locations.length > 0 && locations.length <= 5 && (
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border z-10 max-w-[200px]">
          <div className="space-y-2">
            {locations.slice(0, 5).map((location, index) => (
              <button
                key={location.id}
                onClick={() => onMarkerClick(location)}
                className="flex items-start gap-2 w-full text-left hover:bg-accent/50 p-1 rounded transition-colors"
              >
                <MapPin className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs truncate">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
