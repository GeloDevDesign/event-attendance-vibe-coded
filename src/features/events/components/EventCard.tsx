import type { JSX } from "react";
import type { EventRecord } from "../types/event.types";

export interface EventCardProps {
  event: EventRecord;
}

export function EventCard(props: EventCardProps): JSX.Element {
  void props;
  return <></>;
}
