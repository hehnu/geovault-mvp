import { useState, useEffect } from "react";
import { Map, List } from "lucide-react";
import { CoordinateForm } from "./components/CoordinateForm";
import { MapView } from "./components/MapView";
import { LocationDrawer } from "./components/LocationDrawer";
import { Button } from "./components/ui/button";
import { Location } from "./types/location";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

const STORAGE_KEY = "saved-locations";
const DEFAULT_CENTER: [number, number] = [20, 0];

export default function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load locations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocations(parsed);
      }
    } catch (error) {
      console.error("Failed to load saved locations:", error);
    }
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch (error) {
      console.error("Failed to save locations:", error);
    }
  }, [locations]);

  const handleAddLocation = (lat: number, lng: number, name: string) => {
    const newLocation: Location = {
      id: crypto.randomUUID(),
      lat,
      lng,
      name,
      timestamp: Date.now(),
    };

    setLocations((prev) => [...prev, newLocation]);
    setMapCenter([lat, lng]);
    toast.success(`Added "${name}" to map`);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    toast.success("Location removed");
  };

  const handleNavigateToLocation = (location: Location) => {
    setMapCenter([location.lat, location.lng]);
  };

  const handleMarkerClick = (location: Location) => {
    toast.info(location.name);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Map className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl">GeoVault</h1>
                <p className="text-sm text-muted-foreground">
                  Pin your coordinates, explore the world
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Saved Locations</span>
              <span className="inline sm:hidden">Locations</span>
              {locations.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                  {locations.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 h-full">
          {/* Left Sidebar - Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CoordinateForm onAddLocation={handleAddLocation} />
            
            {/* Quick Tips */}
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <h3 className="mb-2">Quick Tips</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Latitude: -90 to 90 (N/S)</li>
                <li>• Longitude: -180 to 180 (E/W)</li>
                <li>• Click markers to view details</li>
                <li>• Share locations with friends</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="h-[500px] lg:h-[calc(100vh-160px)]">
            {locations.length === 0 ? (
              <div className="w-full h-full rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                  <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h2 className="mb-2">No Locations Yet</h2>
                  <p className="text-muted-foreground">
                    Enter latitude and longitude coordinates to add your first location to the map
                  </p>
                </div>
              </div>
            ) : (
              <MapView
                locations={locations}
                center={mapCenter}
                onMarkerClick={handleMarkerClick}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Drawer */}
      <LocationDrawer
        locations={locations}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onDeleteLocation={handleDeleteLocation}
        onNavigateToLocation={handleNavigateToLocation}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
