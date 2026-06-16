import L from "leaflet";
import { useEffect, useRef, type JSX } from "react";

export interface EventLocationPickerProps {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  onChange(location: { latitude: number; longitude: number }): void;
}

export function EventLocationPicker({
  latitude,
  longitude,
  radiusMeters,
  onChange,
}: EventLocationPickerProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const onChangeRef = useRef(onChange);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current).setView([latitude, longitude], 16);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (event) => {
      onChangeRef.current({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const position: L.LatLngExpression = [latitude, longitude];

    if (!markerRef.current) {
      markerRef.current = L.marker(position).addTo(map);
    } else {
      markerRef.current.setLatLng(position);
    }

    if (!circleRef.current) {
      circleRef.current = L.circle(position, { radius: radiusMeters }).addTo(map);
    } else {
      circleRef.current.setLatLng(position);
      circleRef.current.setRadius(radiusMeters);
    }

    map.setView(position);
  }, [latitude, longitude, radiusMeters]);

  return (
    <div className="grid gap-2">
      <div
        ref={containerRef}
        className="h-80 overflow-hidden rounded-lg border border-slate-300"
      />
      <p className="text-sm text-slate-600">
        Click the map to set the event place.
      </p>
    </div>
  );
}
