import type { JSX } from "react";
import type {
  EventMapLocation,
  MapAttendee,
} from "../types/attendance-map.types";

export interface DistanceLineProps {
  event: EventMapLocation;
  attendee: MapAttendee;
}

export function DistanceLine(props: DistanceLineProps): JSX.Element {
  void props;
  return <></>;
}
