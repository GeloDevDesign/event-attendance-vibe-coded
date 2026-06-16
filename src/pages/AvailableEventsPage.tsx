import type { JSX } from "react";
import { PixelLayout } from "../components/PixelLayout";
import { useAuthentication } from "../features/authentication/hooks/useAuthentication";
import { EventList } from "../features/events/components/EventList";
import { useEvents } from "../features/events/hooks/useEvents";

export function AvailableEventsPage(): JSX.Element {
  const { events, isLoading, error } = useEvents({ scope: "open" });
  const { user } = useAuthentication();
  const isAdmin = user?.role === "admin";

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Available Events</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">Browse events you can join.</p>
      </header>
      {isLoading ? <p>Loading events...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!isLoading && !error ? (
        <EventList
          events={events}
          emptyMessage="No open events yet."
          canRegister={!isAdmin}
          getViewHref={
            isAdmin ? (event) => `/admin/events/${event.id}` : undefined
          }
        />
      ) : null}
    </PixelLayout>
  );
}
