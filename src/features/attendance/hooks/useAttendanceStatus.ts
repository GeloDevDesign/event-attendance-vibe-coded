export interface AttendanceStatusState {
  label: "Present" | "Not Present";
  isPresent: boolean;
}

export function useAttendanceStatus(isPresent: boolean): AttendanceStatusState {
  return {
    label: isPresent ? "Present" : "Not Present",
    isPresent,
  };
}
