import type {
  EventMapLocation,
  MapAttendee,
} from "../types/attendance-map.types";

export function createMapMarkerConfig(event: EventMapLocation): EventMapLocation {
  return event;
}

export function applyMarkerOffset(attendee: MapAttendee): MapAttendee {
  return attendee;
}
