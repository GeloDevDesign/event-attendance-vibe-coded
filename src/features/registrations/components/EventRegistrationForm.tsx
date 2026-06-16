import { useState, type FormEvent, type JSX } from "react";

import type { CharacterRecord } from "../../characters/types/character.types";
import { CharacterSelector } from "../../characters/components/CharacterSelector";
import { validateRegistrationFormValues } from "../services/registrationService";
import type {
  EventRegistrationFormProps,
  RegistrationFormValues,
} from "../types/registration.types";

export function EventRegistrationForm(props: EventRegistrationFormProps): JSX.Element {
  const { eventName, characters, isSubmitting, error, onSubmit, onSuccess } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [characterId, setCharacterId] = useState<CharacterRecord["id"] | "">(
    characters[0]?.id ?? "",
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage(null);

    const selectedCharacterId = characterId || characters[0]?.id;
    if (!selectedCharacterId) {
      setFormError("Character selection is required.");
      return;
    }

    const values: RegistrationFormValues = {
      firstName,
      lastName,
      characterId: selectedCharacterId,
    };

    const validation = validateRegistrationFormValues(values);
    if (!validation.isValid) {
      setFormError(validation.errors.join(" "));
      return;
    }

    const registration = await onSubmit(validation.normalizedValues);
    if (!registration) {
      return;
    }

    setFormError(null);
    setSuccessMessage(`${registration.firstName} ${registration.lastName} registered successfully.`);
    setFirstName("");
    setLastName("");
    setCharacterId(characters[0]?.id ?? "");
    onSuccess(registration);
  }

  if (characters.length === 0) {
    return <p>No active characters are available for this event.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
      <header>
        <h2>{eventName ?? "Event registration"}</h2>
        <p>Enter your name and select an active character to join this event.</p>
      </header>

      <label>
        <span>First name</span>
        <input
          name="firstName"
          value={firstName}
          onChange={(changeEvent) => setFirstName(changeEvent.target.value)}
        />
      </label>

      <label>
        <span>Last name</span>
        <input
          name="lastName"
          value={lastName}
          onChange={(changeEvent) => setLastName(changeEvent.target.value)}
        />
      </label>

      <section aria-label="Character selection">
        <p className="mb-3 text-sm font-black text-slate-800">Character</p>
        <CharacterSelector
          characters={characters}
          selectedCharacterId={characterId || undefined}
          onSelect={setCharacterId}
        />
      </section>

      {formError ? <p role="alert">{formError}</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {successMessage ? <p>{successMessage}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
