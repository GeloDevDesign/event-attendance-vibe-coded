import type { JSX } from "react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { AttendanceMapProps } from "../types/attendance-map.types";

export function AttendanceMap(props: AttendanceMapProps & { event: { imageUrl?: string } }): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const eventLayerRef = useRef<L.LayerGroup | null>(null);
  const animatedMarkersRef = useRef<Array<{
    marker: L.Marker;
    line: L.Polyline | null;
    eventLat: number;
    eventLng: number;
    baseLat: number;
    baseLng: number;
    seed1: number;
    seed2: number;
    isInside: boolean;
  }>>([]);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      const time = Date.now() / 1000;
      animatedMarkersRef.current.forEach(m => {
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
          if (m.line) {
            m.line.setLatLngs([[m.eventLat, m.eventLng], [newLat, newLng]]);
          }
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

    L.marker(eventPosition, eventIcon ? { icon: eventIcon } : undefined).bindPopup(props.event.locationName).addTo(layer);
    L.circle(eventPosition, {
      radius: props.event.radiusMeters,
      color: "#059669",
      fillColor: "#10b981",
      fillOpacity: 0.15,
    }).addTo(layer);

    const bounds = L.latLngBounds([eventPosition]);

    const allUsers = [];
    if (props.userLocation) {
      allUsers.push(props.userLocation);
    }
    if (props.otherUsers) {
      allUsers.push(...props.otherUsers);
    }

    allUsers.forEach((loc) => {
      const userPosition: L.LatLngExpression = [
        loc.latitude,
        loc.longitude,
      ];
      
      const dist = map.distance(eventPosition, userPosition);
      const isInside = dist <= props.event.radiusMeters;
      let finalIconUrl = loc.characterImageUrl;
      if (isInside && finalIconUrl) {
        finalIconUrl = finalIconUrl.replace("_idle.gif", "_walk.gif").replace("_Idle.gif", "_Walk.gif");
      }

      const icon = finalIconUrl
        ? L.icon({
            iconUrl: finalIconUrl,
            iconSize: loc.isCurrentUser ? [44, 44] : [32, 32],
            iconAnchor: loc.isCurrentUser ? [22, 44] : [16, 32],
          })
        : undefined;

      const newMarker = L.marker(userPosition, icon ? { icon } : undefined)
        .bindPopup(loc.isCurrentUser ? `You (Accuracy: ${Math.round(loc.accuracyMeters)}m)` : loc.firstName ? `${loc.firstName} ${loc.lastName}` : `Adventurer`)
        .addTo(layer);
        
      let newLine = null;
      if (loc.isCurrentUser) {
        newLine = L.polyline([eventPosition, userPosition], { color: "#f97316" }).addTo(layer);
      }

      if (icon) {
        animatedMarkersRef.current.push({
          marker: newMarker,
          line: newLine,
          eventLat: eventPosition[0] as number,
          eventLng: eventPosition[1] as number,
          baseLat: userPosition[0] as number,
          baseLng: userPosition[1] as number,
          seed1: Math.random() * Math.PI * 2,
          seed2: Math.random() * Math.PI * 2,
          isInside,
        });
      }
      bounds.extend(userPosition);
    });

    if (allUsers.length > 0) {
      map.fitBounds(bounds.pad(0.3));
    } else {
      map.setView(eventPosition, 17);
    }
  }, [props.event, props.userLocation, props.otherUsers]);

  return (
    <div className="grid gap-2">
      <div
        ref={containerRef}
        className="h-[400px] border-4 border-black bg-white shadow-[4px_4px_0_0_#000] z-0"
      />
    </div>
  );
}
