"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import mapboxgl from "mapbox-gl";
// @ts-ignore
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

interface MapboxAddressInputProps {
  onAddressSelect: (data: {
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  }) => void;
  mapboxToken: string;
}

const MapboxAddressInput = ({
  onAddressSelect,
  mapboxToken,
}: MapboxAddressInputProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Handle Autofill Retrieve (Coordinates only, as fields are autofilled by attributes)
  const handleAutofillRetrieve = useCallback(
    (res: any) => {
      const feature = res.features?.[0];
      if (!feature?.geometry?.coordinates) return;

      const [longitude, latitude] = feature.geometry.coordinates;

      // We can also extract address data here if we want to sync with the map/geocoder
      // But for now, we just pass what we have.
      // The form fields are filled by the browser/mapbox script via autocomplete attributes.

      // If we want to update the map center:
      if (map.current) {
        map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
        // Add a marker?
      }

      // Note: Autofill fills the inputs directly. 
      // We might want to capture the full data here too if we want to be consistent,
      // but the requirement says "The fields should continue to be automatically filled by Mapbox Search JS".
      // So we mainly need to capture coordinates here.

      // However, onAddressSelect expects full data. 
      // We can try to extract it from the feature if available, or just pass empty strings 
      // and let the form inputs hold the values (since they are controlled/uncontrolled).
      // But LocationSection uses setValue, so we should probably pass the data if possible.

      const { properties } = feature;
      const address = properties.address_line1 || properties.place_name || "";
      const city = properties.place || properties.context?.find((c: any) => c.id.startsWith('place'))?.text || "";
      const state = properties.region || properties.context?.find((c: any) => c.id.startsWith('region'))?.text || "";

      onAddressSelect({
        address,
        city,
        state,
        latitude,
        longitude
      });
    },
    [onAddressSelect]
  );

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.08175, 4.60971], // Default to Bogota
      zoom: 11,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxToken,
      mapboxgl: mapboxgl,
      marker: true,
      countries: 'co', // Limit to Colombia
    });

    map.current.addControl(geocoder);

    geocoder.on("result", (e: any) => {
      const { result } = e;
      const [longitude, latitude] = result.geometry.coordinates;

      const context = result.context || [];
      const city = context.find((c: any) => c.id.startsWith('place'))?.text || "";
      const state = context.find((c: any) => c.id.startsWith('region'))?.text || "";
      const address = result.place_name || ""; // Or construct from properties

      onAddressSelect({
        address,
        city,
        state,
        latitude,
        longitude,
      });
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      map.current?.resize();
    });

  }, [mapboxToken, onAddressSelect]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mapbox-address">Dirección *</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <AddressAutofill
            accessToken={mapboxToken}
            onRetrieve={handleAutofillRetrieve}
            options={{
              language: "es",
              country: "co",
            }}
          >
            <Input
              id="mapbox-address"
              placeholder="Escribe tu dirección..."
              className="pl-10 transition-smooth"
              autoComplete="address-line1"
              type="text"
            />
          </AddressAutofill>
        </div>
      </div>

      <div className="h-[300px] w-full rounded-lg overflow-hidden border border-border relative">
        <div ref={mapContainer} className="h-full w-full" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <span className="text-sm text-muted-foreground">Cargando mapa...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxAddressInput;