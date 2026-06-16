import type { JSX } from "react";
import { getJoinedEventsEmptyMessage } from "../services/registrationService";
import { RegistrationCard } from "./RegistrationCard";
import type { JoinedEventRecord } from "../types/registration.types";

export interface RegistrationListProps {
  registrations: JoinedEventRecord[];
  emptyMessage?: string;
}

export function RegistrationList(props: RegistrationListProps): JSX.Element {
  if (props.registrations.length === 0) {
    return <p>{props.emptyMessage ?? getJoinedEventsEmptyMessage()}</p>;
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {props.registrations.map((registration) => (
        <RegistrationCard key={registration.id} registration={registration} />
      ))}
    </div>
  );
}
