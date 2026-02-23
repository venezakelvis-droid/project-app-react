import React from "react";
import "./Input.css";
import type { InputProps } from "./types";



export function Input({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  disabled = false,
  required = false,
  readOnly = false,
  error,
  className = "",
  leftIcon,
  rightIcon,
}: InputProps) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className={`input-container ${error ? "input--error" : ""}`}>
        {leftIcon && <span className="input-icon input-icon--left">{leftIcon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          className="input-field"
        />
        {rightIcon && <span className="input-icon input-icon--right">{rightIcon}</span>}
      </div>

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}