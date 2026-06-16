import type { Coordinate } from "../../attendance/types/attendance.types";

export interface LocationSearchResult extends Coordinate {
  locationName: string;
}

export async function searchLocation(query: string): Promise<LocationSearchResult[]> {
  void query;
  return [];
}

export async function reverseGeocode(
  coordinate: Coordinate,
): Promise<LocationSearchResult | null> {
  void coordinate;
  return null;
}
