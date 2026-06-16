import type { JSX } from "react";
import type { AttendanceResultData } from "../types/attendance.types";

export interface AttendanceResultProps {
  result: AttendanceResultData;
}

export function AttendanceResult(props: AttendanceResultProps): JSX.Element {
  void props;
  return <></>;
}
