import { useEffect, useState, type FormEvent, type JSX } from "react";

import {
  validateCharacterFormValues,
} from "../services/characterService";
import type { CharacterFormValues } from "../types/character.types";

export interface CharacterFormProps {
  initialValues?: Partial<CharacterFormValues>;
  onSubmit(values: CharacterFormValues): Promise<void>;
  submitLabel?: string;
}

const defaultValues: CharacterFormValues = {
  name: "",
  imageUrl: "",
  isActive: true,
};

export function CharacterForm({
  initialValues,
  onSubmit,
  submitLabel = "Save character",
}: CharacterFormProps): JSX.Element {
  const [values, setValues] = useState<CharacterFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
    });
    setError(null);
    setSuccessMessage(null);
  }, [initialValues]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validation = validateCharacterFormValues(values);
    if (!validation.isValid) {
      setError(validation.errors.join(" "));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: values.name.trim(),
        imageUrl: values.imageUrl.trim(),
        isActive: values.isActive,
      });
      setSuccessMessage("Character saved successfully.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save character.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Character name</span>
        <input
          name="name"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          disabled={isSubmitting}
        />
      </label>
      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Image URL</span>
        <input
          name="imageUrl"
          value={values.imageUrl}
          onChange={(event) =>
            setValues((current) => ({ ...current, imageUrl: event.target.value }))
          }
          disabled={isSubmitting}
        />
      </label>
      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(event) =>
            setValues((current) => ({ ...current, isActive: event.target.checked }))
          }
          disabled={isSubmitting}
        />
        <span>Active</span>
      </label>
      {error ? <p role="alert">{error}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
