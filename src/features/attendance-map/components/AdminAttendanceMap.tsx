import type { JSX } from "react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useAttendeeMapData } from "../hooks/useAttendeeMapData";
import type { AdminAttendanceMapProps } from "../types/attendance-map.types";

export function AdminAttendanceMap(props: AdminAttendanceMapProps): JSX.Element {
  const { attendees, isLoading, error } = useAttendeeMapData(props.eventId);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current).setView(
      [props.event.latitude, props.event.longitude],
      17,
    );
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) {
      return;
    }

    layer.clearLayers();

    const eventPosition: L.LatLngExpression = [
      props.event.latitude,
      props.event.longitude,
    ];

    L.marker(eventPosition)
      .bindPopup(`Event: ${props.event.locationName}`)
      .addTo(layer);
    L.circle(eventPosition, {
      radius: props.event.radiusMeters,
      color: "#059669",
      fillColor: "#10b981",
      fillOpacity: 0.15,
    }).addTo(layer);

    const bounds = L.latLngBounds([eventPosition]);

    attendees.forEach((attendee, index) => {
      if (attendee.latitude === null || attendee.longitude === null) {
        return;
      }

      const offset = (index % 6) * 0.000015;
      const attendeePosition: L.LatLngExpression = [
        attendee.latitude + offset,
        attendee.longitude + offset,
      ];
      const icon = L.icon({
        iconUrl: attendee.characterImageUrl,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      L.marker(attendeePosition, { icon })
        .bindPopup(
          `${attendee.attendeeName}<br>${attendee.characterName}<br>${Math.round(
            attendee.distanceMeters ?? 0,
          )}m from event`,
        )
        .addTo(layer);
      L.polyline([eventPosition, attendeePosition], {
        color: "#f97316",
        weight: 2,
      }).addTo(layer);
      bounds.extend(attendeePosition);
    });

    map.fitBounds(bounds.pad(0.25));
  }, [attendees, props.event]);

  const presentCount = attendees.filter((attendee) => attendee.isPresent).length;

  return (
    <section className="grid gap-4">
      {isLoading ? <p>Loading attendee map...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      <div
        ref={containerRef}
        className="h-[520px] overflow-hidden rounded-lg border-4 border-black bg-white"
      />
      <div className="grid gap-2 rounded-md border-4 border-black bg-white p-4 text-sm">
        <p className="font-black">
          Present: {presentCount} / {attendees.length}
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {attendees.map((attendee) => (
            <article
              key={attendee.registrationId}
              className="flex items-center gap-3 rounded-md border border-slate-200 p-2"
            >
              <img
                src={attendee.characterImageUrl}
                alt={attendee.characterName}
                className="h-10 w-10 object-contain [image-rendering:pixelated]"
              />
              <div>
                <p className="font-bold">{attendee.attendeeName}</p>
                <p>{attendee.characterName}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
