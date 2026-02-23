import React from "react";
import "./Button.css";
import type { ButtonProps } from "./types";



export function Button({
  variant = "default",
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}