import type { JSX, ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  name: string;
  children?: ReactNode;
  error?: string;
}

export function FormField(props: FormFieldProps): JSX.Element {
  void props;
  return <></>;
}
