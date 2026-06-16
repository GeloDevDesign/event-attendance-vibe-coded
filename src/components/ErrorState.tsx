import type { JSX } from "react";

export interface ErrorStateProps {
  message: string;
  onRetry?(): void;
}

export function ErrorState(props: ErrorStateProps): JSX.Element {
  void props;
  return <></>;
}
