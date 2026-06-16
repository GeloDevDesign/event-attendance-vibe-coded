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
        <p className="text-[10px] text-stone-700 leading-relaxed">Click the map to set the event place.</p>
      </header>
      {error ? <p className="mb-4 border-4 border-black bg-red-500 p-3 text-white text-[10px] shadow-[4px_4px_0_0_#000]">{error}</p> : null}
      {isSubmitting ? <p className="mb-4 text-[10px] border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">Saving event...</p> : null}
      <EventForm onSubmit={submit} />
    </PixelLayout>
  );
}
