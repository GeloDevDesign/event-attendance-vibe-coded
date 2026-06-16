import type { ButtonHTMLAttributes, JSX, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function Button(props: ButtonProps): JSX.Element {
  void props;
  return <></>;
}
