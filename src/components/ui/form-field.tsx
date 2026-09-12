import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Form-field foundation — S2.4 §14/§15: a visible label above every control,
 * and an error that is both a visual cue AND programmatically associated
 * (`aria-invalid` + `aria-describedby`) with the control, never colour alone.
 *
 * Usage: pass `children` as a render function so the caller wires the
 * generated ids onto the actual `Input`/`Textarea`/`RadioGroup` explicitly —
 * this stays typesafe and avoids prop-cloning magic.
 *
 * ```tsx
 * <FormField label="Số điện thoại" error={errors.phone}>
 *   {(field) => <Input {...field} type="tel" />}
 * </FormField>
 * ```
 */
export interface FormFieldRenderProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

export interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (field: FormFieldRenderProps) => React.ReactNode;
}

function FormField({ label, hint, error, required, className, children }: FormFieldProps) {
  const generatedId = React.useId();
  const hintId = hint ? `${generatedId}-hint` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={generatedId}>
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      {children({ id: generatedId, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error ? (
        <p id={hintId} className="text-caption mt-1 text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-caption mt-1 text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
