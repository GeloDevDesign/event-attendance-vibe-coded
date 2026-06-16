import type { JSX } from "react";
import { Link } from "react-router-dom";
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
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          className="rounded-md bg-emerald-950 px-3 py-2 text-sm font-bold text-white"
          to={`/events/${registration.eventId}`}
        >
          View event
        </Link>
        <Link
          className="rounded-md border border-emerald-950 px-3 py-2 text-sm font-bold text-emerald-950"
          to={`/events/${registration.eventId}/attendance`}
        >
          Make attendance
        </Link>
      </div>
    </article>
  );
}
