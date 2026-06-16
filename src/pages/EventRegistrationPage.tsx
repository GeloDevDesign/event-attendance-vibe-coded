import { useState, type JSX } from "react";

import { useCharacters } from "../features/characters/hooks/useCharacters";
import { EventRegistrationForm } from "../features/registrations/components/EventRegistrationForm";
import { useEventRegistration } from "../features/registrations/hooks/useEventRegistration";
import type { Id } from "../../convex/_generated/dataModel";
import type { EventRegistrationRecord } from "../features/registrations/types/registration.types";

export interface EventRegistrationPageProps {
  eventId?: Id<"events">;
  eventName?: string;
}

export function EventRegistrationPage(
  props: EventRegistrationPageProps = {},
): JSX.Element {
  const { characters, isLoading, error, isEmpty } = useCharacters({ scope: "active" });
  const { isSubmitting, error: submitError, submit } = useEventRegistration({
    eventId: props.eventId,
  });
  const [pageMessage, setPageMessage] = useState<string | null>(null);

  function handleSuccess(registration: EventRegistrationRecord) {
    setPageMessage(
      `${registration.firstName} ${registration.lastName} joined successfully.`,
    );
  }

  if (!props.eventId) {
    return <p>Select an event before registering.</p>;
  }

  if (isLoading) {
    return <p>Loading active characters...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (isEmpty) {
    return <p>No active characters are available yet.</p>;
  }

  return (
    <main style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>Event Registration</h1>
        <p>Choose your name and active character to join this event.</p>
      </header>
      {pageMessage ? <p>{pageMessage}</p> : null}
      <EventRegistrationForm
        eventId={props.eventId}
        eventName={props.eventName}
        characters={characters}
        isSubmitting={isSubmitting}
        error={submitError}
        onSubmit={submit}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
