import type { JSX } from "react";
import { RegistrationStatusBadge } from "./RegistrationStatusBadge";
import type { JoinedEventRecord } from "../types/registration.types";

export interface RegistrationCardProps {
  registration: JoinedEventRecord;
}

export function RegistrationCard(props: RegistrationCardProps): JSX.Element {
  const { registration } = props;

  return (
    <article>
      <header>
        <h3>{registration.eventName}</h3>
        <RegistrationStatusBadge isAccepted={registration.isAccepted} />
      </header>
      <p>{registration.locationName}</p>
      <p>
        {registration.firstName} {registration.lastName}
      </p>
      <p>{registration.characterName}</p>
      <p>{new Date(registration.eventDate).toLocaleDateString()}</p>
    </article>
  );
}
