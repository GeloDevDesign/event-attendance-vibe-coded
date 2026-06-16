import type { JSX } from "react";
import type { EventRegistrationRecord } from "../types/registration.types";

export interface RegistrationCardProps {
  registration: EventRegistrationRecord;
}

export function RegistrationCard(props: RegistrationCardProps): JSX.Element {
  void props;
  return <></>;
}
