export interface AttendanceCountdownState {
  isOpen: boolean;
  isClosed: boolean;
  remainingMs: number;
}

export function useAttendanceCountdown(
  startsAt: number,
  endsAt: number,
): AttendanceCountdownState {
  void startsAt;
  void endsAt;
  return {
    isOpen: false,
    isClosed: false,
    remainingMs: 0,
  };
}
