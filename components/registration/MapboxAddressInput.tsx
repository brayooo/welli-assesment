"use client";

import { useEffect, useRef, useState } from "react";


import mapboxgl from "mapbox-gl";
// @ts-ignore
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { normalizeMapboxLocation } from "@/lib/mapbox";

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



  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    console.log("Initializing Mapbox with token present:", !!mapboxToken);
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.08175, 4.60971],
      zoom: 11,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxToken,
      mapboxgl: mapboxgl,
      marker: true,
      countries: 'co',
    });

    map.current.addControl(geocoder);

    geocoder.on("result", (e: any) => {
      const { result } = e;
      const [longitude, latitude] = result.geometry.coordinates;


      const { city, state: rawState } = normalizeMapboxLocation({ features: [result] });


      const state = rawState || city;

      const address = result.place_name || "";

      onAddressSelect({
        address,
        city,
        state,
        latitude,
        longitude,
      });
    });

    geocoder.on("loading", () => {
      console.log("Mapbox Geocoder: Loading...");
    });

    geocoder.on("results", (e: any) => {
      console.log("Mapbox Geocoder: Results found", e);
    });

    geocoder.on("clear", () => {
      console.log("Mapbox Geocoder: Cleared");
    });

    geocoder.on("error", (e: any) => {
      console.error("Mapbox Geocoder Error:", e);
    });

    map.current.on("load", () => {
      console.log("Mapbox Map Loaded");
      setMapLoaded(true);
      map.current?.resize();
    });

  }, [mapboxToken, onAddressSelect]);

  return (
    <div className="space-y-4">


      <div className="h-[300px] w-full rounded-lg border border-border relative mapbox-container-custom">
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