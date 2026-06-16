import type {
  JoinedEventRecord,
  RegistrationFormValues,
  RegistrationValidationResult,
} from "../types/registration.types";

export function normalizeRegistrationFormValues(
  values: RegistrationFormValues,
): RegistrationFormValues {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    characterId: values.characterId,
  };
}

export function validateRegistrationFormValues(
  values: RegistrationFormValues,
): RegistrationValidationResult {
  const normalizedValues = normalizeRegistrationFormValues(values);
  const errors: string[] = [];

  if (normalizedValues.firstName.length === 0) {
    errors.push("First name is required.");
  }

  if (normalizedValues.lastName.length === 0) {
    errors.push("Last name is required.");
  }

  if (!String(normalizedValues.characterId).trim()) {
    errors.push("Character selection is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedValues,
  };
}

export function sortJoinedEventsByDate(
  joinedEvents: JoinedEventRecord[],
): JoinedEventRecord[] {
  return [...joinedEvents].sort((left, right) => {
    if (left.eventDate !== right.eventDate) {
      return right.eventDate - left.eventDate;
    }

    return right.registeredAt - left.registeredAt;
  });
}

export function formatRegistrationStatus(isAccepted: boolean): string {
  return isAccepted ? "Accepted" : "Pending";
}

export function getRegistrationDisplayName(
  firstName: string,
  lastName: string,
): string {
  return `${firstName} ${lastName}`.trim();
}

export function getJoinedEventsEmptyMessage(): string {
  return "No joined events yet.";
}
