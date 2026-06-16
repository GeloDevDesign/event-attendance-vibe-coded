import type {
  AuthenticationValidationResult,
  ConvexAuthState,
  LoginFormValues,
  RegisterAccountFormValues,
} from "../types/authentication.types";

export function normalizeLoginValues(values: LoginFormValues): LoginFormValues {
  return {
    email: values.email.trim().toLowerCase(),
    password: values.password,
  };
}

export function normalizeRegisterAccountValues(
  values: RegisterAccountFormValues,
): RegisterAccountFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    selectedCharacterId: values.selectedCharacterId,
  };
}

export function validateLoginValues(
  values: LoginFormValues,
): AuthenticationValidationResult<LoginFormValues> {
  const normalizedValues = normalizeLoginValues(values);
  const errors: string[] = [];

  if (!normalizedValues.email) {
    errors.push("Email is required.");
  }

  if (!normalizedValues.password) {
    errors.push("Password is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedValues,
  };
}

export function validateRegisterAccountValues(
  values: RegisterAccountFormValues,
): AuthenticationValidationResult<RegisterAccountFormValues> {
  const normalizedValues = normalizeRegisterAccountValues(values);
  const errors: string[] = [];

  if (!normalizedValues.name) {
    errors.push("Name is required.");
  }

  if (!normalizedValues.email) {
    errors.push("Email is required.");
  }

  if (normalizedValues.password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (!normalizedValues.selectedCharacterId) {
    errors.push("Please select a character.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedValues,
  };
}

export function createConvexAuthState(auth: ConvexAuthState): ConvexAuthState {
  return auth;
}
