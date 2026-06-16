import type { JSX } from "react";

export interface RegistrationStatusBadgeProps {
  isAccepted: boolean;
}

export function RegistrationStatusBadge(props: RegistrationStatusBadgeProps): JSX.Element {
  return (
    <span 
      className={`inline-block px-3 py-1 text-[10px] uppercase border-4 border-black shadow-[2px_2px_0_0_#000] ${props.isAccepted ? "bg-emerald-400 text-black" : "bg-amber-400 text-black"}`}
      aria-label={props.isAccepted ? "Accepted registration" : "Pending registration"}
    >
      {props.isAccepted ? "ACCEPTED" : "PENDING"}
    </span>
  );
}
