import type { JSX } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";

export interface AttendanceButtonProps {
  eventId: Id<"events">;
  registrationId: Id<"eventRegistrations">;
  disabled?: boolean;
}

export function AttendanceButton(props: AttendanceButtonProps): JSX.Element {
  void props;
  return <></>;
}
