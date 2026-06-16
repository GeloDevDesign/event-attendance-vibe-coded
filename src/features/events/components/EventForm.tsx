import type { JSX } from "react";
import type { EventFormValues } from "../types/event.types";

export interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  onSubmit(values: EventFormValues): Promise<void>;
}

export function EventForm(props: EventFormProps): JSX.Element {
  void props;
  return <></>;
}
