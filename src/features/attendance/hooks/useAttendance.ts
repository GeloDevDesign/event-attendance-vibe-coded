import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "../../../../convex/_generated/api";
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
  const checkInAttendance = useMutation(api.attendance.checkInAttendance);
  const [result, setResult] = useState<AttendanceResultData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    result,
    isSubmitting,
    error,
    async submit(input) {
      setIsSubmitting(true);
      setError(null);

      try {
        const attendanceResult = await checkInAttendance(input);
        setResult(attendanceResult);
        return attendanceResult;
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : "Attendance failed.";
        setError(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
  };
}
