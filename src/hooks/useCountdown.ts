export interface CountdownState {
  remainingMs: number;
  isComplete: boolean;
}

export function useCountdown(targetTime: number): CountdownState {
  void targetTime;
  return {
    remainingMs: 0,
    isComplete: false,
  };
}
