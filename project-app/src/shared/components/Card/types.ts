import type { ReactNode } from "react";

export type CardVariant = "elevated" | "outlined";

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: CardVariant;
}