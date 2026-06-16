import type { JSX } from "react";

import { RegistrationList } from "../features/registrations/components/RegistrationList";
import { useJoinedEvents } from "../features/registrations/hooks/useJoinedEvents";
import { PixelLayout } from "../components/PixelLayout";

export function JoinedEventsPage(): JSX.Element {
  const { registrations, isLoading, error, isEmpty } = useJoinedEvents();

  return (
    <PixelLayout maxWidth="max-w-[800px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Joined Events</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">These are the events you have already joined.</p>
      </header>

      {isLoading ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">Loading joined events...</p> : null}
      {error ? <p className="text-[10px] border-4 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0_0_#000]" role="alert">{error}</p> : null}
      {!isLoading && isEmpty ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">No joined events yet.</p> : null}
      {!isLoading && !error && !isEmpty ? <RegistrationList registrations={registrations} /> : null}
    </PixelLayout>
  );
}
