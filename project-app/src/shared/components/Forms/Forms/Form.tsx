import { useState } from "react";

import type { FormProps } from "./types";
import "./Form.css";
import { Input } from "../../Input";
import { Button } from "../../Button";

export function Form<T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  loading = false,
}: FormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  function handleChange(name: keyof T, value: any) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // limpa erro ao digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof T, string>> = {};

    fields.forEach((field) => {
      if (field.required && !values[field.name as keyof T]) {
        newErrors[field.name as keyof T] = "Campo obrigatório";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(values);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <Input
          key={field.name}
          id={field.name}
          label={field.label}
          type={field.type || "text"}
          value={values[field.name as keyof T] ?? ""}
          placeholder={field.placeholder}
          required={field.required}
          disabled={field.disabled}
          readOnly={field.readOnly}
          leftIcon={field.leftIcon}
          rightIcon={field.rightIcon}
          error={errors[field.name as keyof T] as string}
          onChange={(e) =>
            handleChange(field.name as keyof T, e.target.value)
          }
        />
      ))}

      <div className="form__actions">
        {onCancel && (
          <Button
            variant="delete"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}

        <Button
          variant="create"
          type="submit"
          disabled={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}