import type { ReactNode } from "react";

export type FormFieldType = "text" | "email" | "password" | "number";

export interface FormField {
  name: string;
  label: string;
  type?: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface FormProps<T extends Record<string, any>> {
  fields: FormField[];
  initialValues: T;
  onSubmit: (values: T) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}