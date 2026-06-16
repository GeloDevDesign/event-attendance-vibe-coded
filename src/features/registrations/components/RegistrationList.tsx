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
    return <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">{props.emptyMessage ?? getJoinedEventsEmptyMessage()}</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {props.registrations.map((registration) => (
        <RegistrationCard key={registration.id} registration={registration} />
      ))}
    </div>
  );
}
