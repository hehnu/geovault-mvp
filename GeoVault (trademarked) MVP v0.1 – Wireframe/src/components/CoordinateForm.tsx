import { useState } from "react";
import { MapPin, Plus, Locate, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { toast } from "sonner@2.0.3";

interface CoordinateFormProps {
  onAddLocation: (lat: number, lng: number, name: string) => void;
}

export function CoordinateForm({ onAddLocation }: CoordinateFormProps) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const validateCoordinates = (lat: string, lng: string): boolean => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setError("Please enter valid numbers");
      return false;
    }

    if (latNum < -90 || latNum > 90) {
      setError("Latitude must be between -90 and 90");
      return false;
    }

    if (lngNum < -180 || lngNum > 180) {
      setError("Longitude must be between -180 and 180");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateCoordinates(latitude, longitude)) {
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const locationName = name.trim() || `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    onAddLocation(lat, lng, locationName);

    // Reset form
    setLatitude("");
    setLongitude("");
    setName("");
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setName("My Current Location");
        setIsGettingLocation(false);
        
        toast.success("Location found!");
      },
      (error) => {
        setIsGettingLocation(false);
        
        let errorMessage = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Card className="p-4 bg-card border-border shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h2>Add Location</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="gap-2"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting...
              </>
            ) : (
              <>
                <Locate className="w-4 h-4" />
                <span className="hidden sm:inline">Use My Location</span>
                <span className="inline sm:hidden">My Location</span>
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="text"
              placeholder="e.g., 40.7128"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="text"
              placeholder="e.g., -74.0060"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="bg-input-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Location Name (Optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Statue of Liberty"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input-background"
          />
        </div>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add to Map
        </Button>
      </form>
    </Card>
  );
}
