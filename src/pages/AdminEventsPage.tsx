import type { JSX } from "react";
import { PixelLayout } from "../components/PixelLayout";
import { EventList } from "../features/events/components/EventList";
import { useEvents } from "../features/events/hooks/useEvents";

export function AdminEventsPage(): JSX.Element {
  const { events, isLoading, error } = useEvents({ scope: "all" });

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Admin Events</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">Manage all events.</p>
      </header>
      {isLoading ? <p>Loading events...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!isLoading && !error ? (
        <EventList
          events={events}
          emptyMessage="No events yet."
          canRegister={false}
          getViewHref={(event) => `/admin/events/${event.id}`}
        />
      ) : null}
    </PixelLayout>
  );
}
