import type {
  AttendanceAttemptInput,
  AttendanceResultData,
} from "../types/attendance.types";

export interface UseAttendanceResult {
  result: AttendanceResultData | null;
  isSubmitting: boolean;
  error: string | null;
  submit(input: AttendanceAttemptInput): Promise<AttendanceResultData | null>;
}

export function useAttendance(): UseAttendanceResult {
  return {
    result: null,
    isSubmitting: false,
    error: null,
    async submit() {
      return null;
    },
  };
}
