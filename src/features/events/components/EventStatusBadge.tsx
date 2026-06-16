import type { JSX } from "react";
import type { EventStatus } from "../types/event.types";

export interface EventStatusBadgeProps {
  status: EventStatus;
}

export function EventStatusBadge(props: EventStatusBadgeProps): JSX.Element {
  void props;
  return <></>;
}
