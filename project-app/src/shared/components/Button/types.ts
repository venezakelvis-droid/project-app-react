import type { MouseEvent, ReactNode } from "react";

export type ButtonVariant = "default" | "create" | "edit" | "delete" | "link";

export interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}