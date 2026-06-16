import type { JSX } from "react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useAttendeeMapData } from "../hooks/useAttendeeMapData";
import type { AdminAttendanceMapProps } from "../types/attendance-map.types";

export function AdminAttendanceMap(props: AdminAttendanceMapProps & { event: { imageUrl?: string } }): JSX.Element {
  const { attendees, isLoading, error } = useAttendeeMapData(props.eventId);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const animatedMarkersRef = useRef<
    Array<{
      marker: L.Marker;
      line: L.Polyline;
      eventLat: number;
      eventLng: number;
      baseLat: number;
      baseLng: number;
      seed1: number;
      seed2: number;
      isInside: boolean;
    }>
  >([]);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      const time = Date.now() / 1000;
      animatedMarkersRef.current.forEach((m) => {
        if (m.isInside) {
          const latOffset =
            Math.sin(time * 1.0 + m.seed1) * 0.00015 +
            Math.sin(time * 0.7 + m.seed2) * 0.00005;
          const lngOffset =
            Math.cos(time * 0.9 + m.seed1) * 0.00015 +
            Math.cos(time * 1.1 + m.seed2) * 0.00005;
          const newLat = m.baseLat + latOffset;
          const newLng = m.baseLng + lngOffset;
          m.marker.setLatLng([newLat, newLng]);
          m.line.setLatLngs([[m.eventLat, m.eventLng], [newLat, newLng]]);
        }
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
    animatedMarkersRef.current = [];

    const eventPosition: L.LatLngExpression = [
      props.event.latitude,
      props.event.longitude,
    ];

    let eventIcon;
    if (props.event.imageUrl) {
      eventIcon = L.icon({
        iconUrl: props.event.imageUrl,
        iconSize: [80, 80],
        iconAnchor: [40, 80],
        className: "[image-rendering:pixelated]"
      });
    }

    L.marker(eventPosition, eventIcon ? { icon: eventIcon } : undefined)
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
      
      let finalIconUrl = attendee.characterImageUrl;
      if (attendee.isPresent) {
        finalIconUrl = finalIconUrl.replace("_idle.gif", "_walk.gif").replace("_Idle.gif", "_Walk.gif");
      }

      const icon = L.icon({
        iconUrl: finalIconUrl,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      const newMarker = L.marker(attendeePosition, { icon })
        .bindPopup(
          `${attendee.attendeeName}<br>${attendee.characterName}<br>${Math.round(
            attendee.distanceMeters ?? 0,
          )}m from event`,
        )
        .addTo(layer);
        
      const newLine = L.polyline([eventPosition, attendeePosition], {
        color: "#f97316",
        weight: 2,
      }).addTo(layer);

      animatedMarkersRef.current.push({
        marker: newMarker,
        line: newLine,
        eventLat: eventPosition[0] as number,
        eventLng: eventPosition[1] as number,
        baseLat: attendeePosition[0] as number,
        baseLng: attendeePosition[1] as number,
        seed1: Math.random() * Math.PI * 2,
        seed2: Math.random() * Math.PI * 2,
        isInside: attendee.isPresent,
      });
      bounds.extend(attendeePosition);
    });

    map.fitBounds(bounds.pad(0.25));
  }, [attendees, props.event]);

  const presentCount = attendees.filter((attendee) => attendee.isPresent).length;

  return (
    <section className="grid gap-4">
      {isLoading ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">Loading attendee map...</p> : null}
      {error ? <p className="text-[10px] border-4 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0_0_#000]" role="alert">{error}</p> : null}
      
      <div
        ref={containerRef}
        className="h-[400px] border-4 border-black bg-white shadow-[4px_4px_0_0_#000] z-0"
      />
      
      <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
        <p className="text-[12px] font-black uppercase text-black mb-3">
          Event Attendees ({presentCount}/{attendees.length})
        </p>
        
        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
          {attendees.map((attendee) => (
            <article
              key={attendee.registrationId}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1 border-2 border-stone-300 rounded-md p-2 w-[100px]"
            >
              <img
                src={attendee.characterImageUrl}
                alt={attendee.characterName}
                className="h-10 w-10 object-contain [image-rendering:pixelated]"
              />
              <div className="text-center mt-1">
                <p className="text-[10px] font-bold text-black leading-none whitespace-nowrap overflow-hidden text-ellipsis w-full">{attendee.attendeeName}</p>
                <p className="text-[8px] text-stone-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">{attendee.characterName}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
