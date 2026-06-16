import type { JSX } from "react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { AttendanceMapProps } from "../types/attendance-map.types";

export function AttendanceMap(props: AttendanceMapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const eventLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current).setView(
      [props.event.latitude, props.event.longitude],
      17,
    );
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    eventLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      eventLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = eventLayerRef.current;
    if (!map || !layer) {
      return;
    }

    layer.clearLayers();

    const eventPosition: L.LatLngExpression = [
      props.event.latitude,
      props.event.longitude,
    ];
    L.marker(eventPosition).bindPopup(props.event.locationName).addTo(layer);
    L.circle(eventPosition, {
      radius: props.event.radiusMeters,
      color: "#059669",
      fillColor: "#10b981",
      fillOpacity: 0.15,
    }).addTo(layer);

    const userLocation = props.userLocation;
    if (userLocation) {
      const userPosition: L.LatLngExpression = [
        userLocation.latitude,
        userLocation.longitude,
      ];
      const icon = userLocation.characterImageUrl
        ? L.icon({
            iconUrl: userLocation.characterImageUrl,
            iconSize: [44, 44],
            iconAnchor: [22, 44],
          })
        : undefined;

      L.marker(userPosition, icon ? { icon } : undefined)
        .bindPopup(`Accuracy: ${Math.round(userLocation.accuracyMeters)}m`)
        .addTo(layer);
      L.polyline([eventPosition, userPosition], { color: "#f97316" }).addTo(layer);
      map.fitBounds(L.latLngBounds([eventPosition, userPosition]).pad(0.3));
      return;
    }

    map.setView(eventPosition, 17);
  }, [props.event, props.userLocation]);

  return (
    <div className="grid gap-2">
      <div
        ref={containerRef}
        className="h-80 overflow-hidden rounded-lg border border-slate-300"
      />
    </div>
  );
}
