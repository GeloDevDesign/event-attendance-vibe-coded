import { useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import { useCharacters } from "../features/characters/hooks/useCharacters";
import { EventRegistrationForm } from "../features/registrations/components/EventRegistrationForm";
import { useEventRegistration } from "../features/registrations/hooks/useEventRegistration";
import type { Id } from "../../convex/_generated/dataModel";
import type { EventRegistrationRecord } from "../features/registrations/types/registration.types";
import { PixelLayout } from "../components/PixelLayout";

export interface EventRegistrationPageProps {
  eventId?: Id<"events">;
  eventName?: string;
}

export function EventRegistrationPage(
  props: EventRegistrationPageProps = {},
): JSX.Element {
  const params = useParams();
  const eventId = props.eventId ?? (params.eventId as Id<"events"> | undefined);
  const { characters, isLoading, error, isEmpty } = useCharacters({ scope: "active" });
  const { isSubmitting, error: submitError, submit } = useEventRegistration({
    eventId,
  });
  const [pageMessage, setPageMessage] = useState<string | null>(null);

  function handleSuccess(registration: EventRegistrationRecord) {
    setPageMessage(
      `${registration.firstName} ${registration.lastName} joined successfully.`,
    );
  }

  if (!eventId) {
    return (
      <PixelLayout>
        <p className="text-[10px] text-red-500">Select an event before registering.</p>
      </PixelLayout>
    );
  }

  if (isLoading) {
    return (
      <PixelLayout>
        <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">Loading active characters...</p>
      </PixelLayout>
    );
  }

  if (error) {
    return (
      <PixelLayout>
        <p className="text-[10px] border-4 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0_0_#000]" role="alert">{error}</p>
      </PixelLayout>
    );
  }

  if (isEmpty) {
    return (
      <PixelLayout>
        <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">No active characters are available yet.</p>
      </PixelLayout>
    );
  }

  return (
    <PixelLayout maxWidth="max-w-[800px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Event Registration</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">
          Choose your name and active character to join this event.
        </p>
      </header>
      {pageMessage ? <p className="border-4 border-black bg-[#3db5e6] px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000] mb-6">{pageMessage}</p> : null}
      <EventRegistrationForm
        eventId={eventId}
        eventName={props.eventName}
        characters={characters}
        isSubmitting={isSubmitting}
        error={submitError}
        onSubmit={submit}
        onSuccess={handleSuccess}
      />
    </PixelLayout>
  );
}
