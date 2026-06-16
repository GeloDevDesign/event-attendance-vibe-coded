import type { JSX } from "react";

export interface StatusBadgeProps {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element {
  void props;
  return <></>;
}
