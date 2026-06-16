import type { JSX, ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader(props: PageHeaderProps): JSX.Element {
  void props;
  return <></>;
}
