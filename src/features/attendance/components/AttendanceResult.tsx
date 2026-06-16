import type { JSX } from "react";
import type { AttendanceResultData } from "../types/attendance.types";

export interface AttendanceResultProps {
  result: AttendanceResultData;
}

export function AttendanceResult(props: AttendanceResultProps): JSX.Element {
  const { result } = props;

  return (
    <section
      className={`rounded-lg border p-4 ${
        result.isPresent
          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
          : "border-amber-300 bg-amber-50 text-amber-950"
      }`}
    >
      <h3 className="font-black">{result.isPresent ? "Present" : "Not Present"}</h3>
      <p>{result.message}</p>
      <p className="text-sm">
        Distance: {Math.round(result.distanceMeters)}m / Radius:{" "}
        {result.allowedRadiusMeters}m
      </p>
      {result.checkedInAt ? (
        <p className="text-sm">Checked in: {new Date(result.checkedInAt).toLocaleString()}</p>
      ) : null}
    </section>
  );
}
