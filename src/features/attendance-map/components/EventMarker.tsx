import type { JSX } from "react";
import type { EventMapLocation } from "../types/attendance-map.types";

export interface EventMarkerProps {
  event: EventMapLocation;
}

export function EventMarker(props: EventMarkerProps): JSX.Element {
  void props;
  return <></>;
}
