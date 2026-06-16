import type { JSX } from "react";
import type { EventRegistrationRecord } from "../types/registration.types";

export interface RegistrationListProps {
  registrations: EventRegistrationRecord[];
}

export function RegistrationList(props: RegistrationListProps): JSX.Element {
  void props;
  return <></>;
}
