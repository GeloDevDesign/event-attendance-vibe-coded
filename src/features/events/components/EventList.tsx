import type { JSX } from "react";
import type { EventRecord } from "../types/event.types";
import { EventCard } from "./EventCard";

export interface EventListProps {
  events: EventRecord[];
  emptyMessage?: string;
  getViewHref?(event: EventRecord): string;
  canRegister?: boolean;
}

export function EventList({
  events,
  emptyMessage = "No events available.",
  getViewHref,
  canRegister = true,
}: EventListProps): JSX.Element {
  if (events.length === 0) {
    return <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">{emptyMessage}</p>;
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          viewHref={getViewHref ? getViewHref(event) : undefined}
          canRegister={canRegister}
        />
      ))}
    </section>
  );
}
