import type { JSX } from "react";
import { PixelLayout } from "../components/PixelLayout";
import { EventForm } from "../features/events/components/EventForm";
import { useEventForm } from "../features/events/hooks/useEventForm";

export function AdminCreateEventPage(): JSX.Element {
  const { submit, isSubmitting, error } = useEventForm();

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Create Event</h1>
        <p className="text-sm text-black">Click the map to set the event place.</p>
      </header>
      {error ? <p className="mb-4 border-4 border-black bg-red-500 p-3 text-white">{error}</p> : null}
      {isSubmitting ? <p className="mb-4">Saving event...</p> : null}
      <EventForm onSubmit={submit} />
    </PixelLayout>
  );
}
