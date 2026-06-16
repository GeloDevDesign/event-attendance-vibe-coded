import type { BrowserLocation, Coordinate } from "../features/attendance/types/attendance.types";

export async function requestBrowserLocation(): Promise<BrowserLocation | null> {
  return null;
}

export function isCoordinateValid(coordinate: Coordinate): boolean {
  void coordinate;
  return false;
}
