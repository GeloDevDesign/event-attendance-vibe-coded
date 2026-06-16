import type { JSX } from "react";
import { PixelLayout } from "../components/PixelLayout";

export function AttendanceResultPage(): JSX.Element {
  return (
    <PixelLayout>
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Attendance Result</h1>
      </header>
    </PixelLayout>
  );
}
