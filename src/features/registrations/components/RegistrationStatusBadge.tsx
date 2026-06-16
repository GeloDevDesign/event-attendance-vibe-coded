import type { JSX } from "react";

export interface RegistrationStatusBadgeProps {
  isAccepted: boolean;
}

export function RegistrationStatusBadge(props: RegistrationStatusBadgeProps): JSX.Element {
  return (
    <span aria-label={props.isAccepted ? "Accepted registration" : "Pending registration"}>
      {props.isAccepted ? "Accepted" : "Pending"}
    </span>
  );
}
