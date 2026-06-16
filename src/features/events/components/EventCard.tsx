import type { JSX } from "react";
import type { EventRecord } from "../types/event.types";
import { PixelButton } from "../../../components/PixelButton";

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
    <article className="grid gap-3 border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
      {event.imageUrl ? (
        <div className="border-4 border-black bg-[#111] overflow-hidden flex items-center justify-center h-32 mb-2">
          <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover [image-rendering:pixelated]" />
        </div>
      ) : null}
      <header>
        <p className="text-[10px] font-black uppercase tracking-wider text-[#3db5e6] mb-2" style={{ textShadow: "1px 1px 0 #000" }}>
          {event.status}
        </p>
        <h3 className="text-xl text-black uppercase drop-shadow-[1px_1px_0_#fff]">{event.name}</h3>
      </header>
      <p className="text-[10px] text-stone-600 leading-relaxed uppercase">{event.locationName}</p>
      <p className="text-[10px] text-stone-600 leading-relaxed">
        {new Date(event.eventDate).toLocaleDateString()} | CAP {event.maximumParticipants}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        <PixelButton variant="secondary" to={viewHref} className="!w-auto !min-h-[40px] !px-4">
          VIEW
        </PixelButton>
        {canRegister && event.status === "open" ? (
          <PixelButton variant="primary" to={`/events/${event.id}/register`} className="!w-auto !min-h-[40px] !px-4">
            JOIN
          </PixelButton>
        ) : null}
      </div>
    </article>
  );
}
