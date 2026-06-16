import type { JSX } from "react";
import { Link } from "react-router-dom";
import type { EventRecord } from "../types/event.types";

export interface EventCardProps {
  event: EventRecord;
  viewHref?: string;
  canRegister?: boolean;
}

export function EventCard(props: EventCardProps): JSX.Element {
  const { event } = props;
  const viewHref = props.viewHref ?? `/events/${event.id}`;
  const canRegister = props.canRegister ?? true;

  return (
    <article className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <header>
        <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
          {event.status}
        </p>
        <h3 className="text-2xl font-black text-slate-950">{event.name}</h3>
      </header>
      <p className="text-slate-600">{event.locationName}</p>
      <p className="text-sm text-slate-600">
        {new Date(event.eventDate).toLocaleDateString()} | Capacity{" "}
        {event.maximumParticipants}
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          className="rounded-md bg-emerald-950 px-4 py-2 text-sm font-bold text-white"
          to={viewHref}
        >
          View
        </Link>
        {canRegister && event.status === "open" ? (
          <Link
            className="rounded-md border border-emerald-950 px-4 py-2 text-sm font-bold text-emerald-950"
            to={`/events/${event.id}/register`}
          >
            Register
          </Link>
        ) : null}
      </div>
    </article>
  );
}
