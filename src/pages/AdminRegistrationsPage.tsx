import type { JSX } from "react";
import { PixelLayout } from "../components/PixelLayout";
import { EventList } from "../features/events/components/EventList";
import { useEvents } from "../features/events/hooks/useEvents";

export function AdminRegistrationsPage(): JSX.Element {
  const { events, isLoading, error } = useEvents({ scope: "all" });

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Registrations</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">Select an event below to view its player sign-ups and manage capacity.</p>
      </header>
      
      {isLoading ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] mb-4">Loading events...</p> : null}
      {error ? <p className="text-[10px] border-4 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0_0_#000] mb-4" role="alert">{error}</p> : null}
      
      {!isLoading && !error ? (
        <div className="bg-[#ebd2a9] border-4 border-black p-6 shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)]">
          <EventList
            events={events}
            emptyMessage="No events found to manage registrations for."
            canRegister={false}
            getViewHref={(event) => `/admin/events/${event.id}/registrations`}
          />
        </div>
      ) : null}
    </PixelLayout>
  );
}
