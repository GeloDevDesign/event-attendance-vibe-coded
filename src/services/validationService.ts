export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function createValidationResult(): ValidationResult {
  return {
    isValid: true,
    errors: [],
  };
}
