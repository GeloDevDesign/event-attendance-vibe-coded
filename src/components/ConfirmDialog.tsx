import type { JSX, ReactNode } from "react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: ReactNode;
  onConfirm?(): void;
  onCancel?(): void;
}

export function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
  void props;
  return <></>;
}
