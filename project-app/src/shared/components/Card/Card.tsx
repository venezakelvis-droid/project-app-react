import React from "react";
import "./Card.css";
import type { CardProps } from "./types";



export function Card({
  title,
  subtitle,
  children,
  footer,
  onClick,
  className = "",
  variant = "elevated",
}: CardProps) {
  const isClickable = Boolean(onClick);

  return (
    <article
      className={`card card--${variant} ${isClickable ? "card--clickable" : ""} ${className}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          onClick?.();
        }
      }}
    >
      {(title || subtitle) && (
        <header className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </header>
      )}

      <div className="card__content">{children}</div>

      {footer && <footer className="card__footer">{footer}</footer>}
    </article>
  );
}