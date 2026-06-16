import type { JSX } from "react";

import { RegistrationList } from "../features/registrations/components/RegistrationList";
import { useJoinedEvents } from "../features/registrations/hooks/useJoinedEvents";

export function JoinedEventsPage(): JSX.Element {
  const { registrations, isLoading, error, isEmpty } = useJoinedEvents();

  return (
    <main style={{ display: "grid", gap: "1.5rem" }}>
      <header>
        <h1>Joined Events</h1>
        <p>These are the events you have already joined.</p>
      </header>

      {isLoading ? <p>Loading joined events...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!isLoading && isEmpty ? <p>No joined events yet.</p> : null}
      {!isLoading && !error && !isEmpty ? <RegistrationList registrations={registrations} /> : null}
    </main>
  );
}
