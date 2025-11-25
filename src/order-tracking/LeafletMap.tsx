"use client";

import { memo, useMemo, useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  route: [number, number][];
  interpolatePosition: () => [number, number];
  truckIcon: Icon;
  mapKey?: string;
}

// Component ID counter to ensure unique IDs
let componentIdCounter = 0;

const LeafletMap = ({ route, interpolatePosition, truckIcon, mapKey }: LeafletMapProps) => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [shouldRender, setShouldRender] = useState(false);
  const componentIdRef = useRef(`leaflet-map-${++componentIdCounter}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapKeyRef = useRef(mapKey || `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const renderAttemptedRef = useRef(false);

  // Icons must be created with useMemo before any returns
  const startIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    []
  );

  const endIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    []
  );

  useEffect(() => {
    // Prevent multiple render attempts
    if (renderAttemptedRef.current) {
      return;
    }

    renderAttemptedRef.current = true;

    // Use a longer delay to ensure StrictMode's double render completes
    const timer = setTimeout(() => {
      // Check if container already has a map
      if (containerRef.current) {
        const hasMap = (containerRef.current as any)._leaflet_id !== undefined;
        if (hasMap) {
          // Map already exists, don't render MapContainer
          return;
        }
      }
      setShouldRender(true);
    }, 100);

    return () => {
      clearTimeout(timer);
      renderAttemptedRef.current = false;
      setShouldRender(false);
    };
  }, []);

  // Update mapKey ref when prop changes - this will force remount
  useEffect(() => {
    if (mapKey && mapKey !== mapKeyRef.current) {
      mapKeyRef.current = mapKey;
      // Reset render state to allow remount with new key
      setShouldRender(false);
      renderAttemptedRef.current = false;
      // Trigger re-render with new key
      setTimeout(() => {
        setShouldRender(true);
      }, 50);
    }
  }, [mapKey]);

  // NOW we can do conditional returns after all hooks
  if (!route || route.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-500">No route data available</p>
      </div>
    );
  }

  if (!shouldRender) {
    return (
      <div 
        ref={containerRef} 
        id={componentIdRef.current}
        className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      id={componentIdRef.current}
      className="h-full w-full relative"
    >
      <MapContainer
        center={route[0]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        key={mapKeyRef.current}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={route} color="blue" weight={3} />
        <Marker position={route[0]} icon={startIcon} />
        <Marker position={route[route.length - 1]} icon={endIcon} />
        <Marker position={interpolatePosition()} icon={truckIcon} />
      </MapContainer>
    </div>
  );
};

export default memo(LeafletMap);
