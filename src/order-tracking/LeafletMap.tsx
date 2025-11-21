"use client";

import { memo, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { Icon } from "leaflet";

interface LeafletMapProps {
  route: [number, number][];
  interpolatePosition: () => [number, number];
  truckIcon: Icon;
}

const LeafletMap = ({ route, interpolatePosition, truckIcon }: LeafletMapProps) => {
  const startIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        iconSize: [30, 30],
      }),
    []
  );

  const endIcon = useMemo(
    () =>
      new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
        iconSize: [30, 30],
      }),
    []
  );

  return (
    <MapContainer center={route[0]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <Polyline positions={route} color="blue" />
      <Marker position={route[0]} icon={startIcon} />
      <Marker position={route[route.length - 1]} icon={endIcon} />
      <Marker position={interpolatePosition()} icon={truckIcon} />
    </MapContainer>
  );
};

export default memo(LeafletMap);
