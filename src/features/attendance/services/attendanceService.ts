import type {
  AttendanceAttemptInput,
  AttendanceResultData,
  AttendanceRecord,
} from "../types/attendance.types";

export async function checkInAttendance(
  input: AttendanceAttemptInput,
): Promise<AttendanceResultData | null> {
  void input;
  return null;
}

export async function getAttendanceByRegistration(): Promise<AttendanceRecord | null> {
  return null;
}
