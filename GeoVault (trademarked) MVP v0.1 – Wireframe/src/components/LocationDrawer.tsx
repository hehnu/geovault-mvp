import { MapPin } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { LocationCard } from "./LocationCard";
import { Location } from "../types/location";

interface LocationDrawerProps {
  locations: Location[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteLocation: (id: string) => void;
  onNavigateToLocation: (location: Location) => void;
}

export function LocationDrawer({
  locations,
  open,
  onOpenChange,
  onDeleteLocation,
  onNavigateToLocation,
}: LocationDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <DrawerTitle>Saved Locations</DrawerTitle>
          </div>
          <DrawerDescription>
            {locations.length === 0
              ? "No saved locations yet. Add your first location above!"
              : `${locations.length} ${locations.length === 1 ? "location" : "locations"} saved`}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 py-4">
            {locations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start by adding coordinates above</p>
              </div>
            ) : (
              locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onDelete={onDeleteLocation}
                  onNavigate={(loc) => {
                    onNavigateToLocation(loc);
                    onOpenChange(false);
                  }}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
