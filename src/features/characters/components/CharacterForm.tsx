import { useEffect, useState, type FormEvent, type JSX } from "react";

import {
  validateCharacterFormValues,
} from "../services/characterService";
import type { CharacterFormValues } from "../types/character.types";
import { PixelButton } from "../../../components/PixelButton";

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
    <form onSubmit={handleSubmit} className="grid gap-6">
      <label className="grid gap-2 text-[12px] text-white">
        <span className="uppercase tracking-wider">CHARACTER NAME</span>
        <input
          className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
          name="name"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          disabled={isSubmitting}
        />
      </label>
      <label className="grid gap-2 text-[12px] text-white">
        <span className="uppercase tracking-wider">IMAGE URL</span>
        <input
          className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
          name="imageUrl"
          value={values.imageUrl}
          onChange={(event) =>
            setValues((current) => ({ ...current, imageUrl: event.target.value }))
          }
          disabled={isSubmitting}
        />
      </label>
      <label className="flex items-center gap-3 text-[12px] text-white cursor-pointer mt-2">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            className="peer appearance-none w-8 h-8 border-4 border-black bg-white shadow-[2px_2px_0_0_#000] checked:bg-[#3db5e6]"
            checked={values.isActive}
            onChange={(event) =>
              setValues((current) => ({ ...current, isActive: event.target.checked }))
            }
            disabled={isSubmitting}
          />
          <span className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 text-[14px] font-bold" style={{ textShadow: "2px 2px 0 #000" }}>✓</span>
        </div>
        <span className="uppercase tracking-wider">ACTIVE</span>
      </label>
      
      {error ? (
        <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000]" role="alert">
          {error}
        </p>
      ) : null}
      {successMessage ? (
        <p className="border-4 border-black bg-emerald-400 px-3 py-3 text-[10px] leading-relaxed text-black shadow-[4px_4px_0_0_#000]">
          {successMessage}
        </p>
      ) : null}
      
      <PixelButton variant="primary" type="submit" disabled={isSubmitting} className="w-full mt-2">
        {isSubmitting ? "SAVING..." : submitLabel}
      </PixelButton>
    </form>
  );
}
