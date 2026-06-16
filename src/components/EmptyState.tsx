import type { JSX, ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState(props: EmptyStateProps): JSX.Element {
  void props;
  return <></>;
}
