import type { JSX } from "react";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { PixelLayout } from "../components/PixelLayout";
import { AttendanceMap } from "../features/attendance-map/components/AttendanceMap";
import { AttendanceResult } from "../features/attendance/components/AttendanceResult";
import { useAttendance } from "../features/attendance/hooks/useAttendance";
import { useCharacters } from "../features/characters/hooks/useCharacters";
import { useEvent } from "../features/events/hooks/useEvent";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

export function AttendancePage(): JSX.Element {
  const params = useParams();
  const eventId = params.eventId as Id<"events"> | undefined;
  const { event, isLoading: isLoadingEvent } = useEvent(eventId);
  const registration = useQuery(
    api.registrations.getRegistrationByEventAndUser,
    eventId ? { eventId } : "skip",
  );
  const attendanceRecord = useQuery(
    api.attendance.getAttendanceByRegistration,
    registration ? { registrationId: registration.id } : "skip",
  );
  const { characters } = useCharacters({ scope: "active" });
  const locationState = useCurrentLocation();
  const attendance = useAttendance();
  const character = characters.find(
    (characterRecord) => characterRecord.id === registration?.characterId,
  );

  async function handleCheckIn() {
    if (!eventId || !registration) {
      return;
    }

    const location = await locationState.requestLocation();
    if (!location) {
      return;
    }

    await attendance.submit({
      eventId,
      registrationId: registration.id,
      ...location,
    });
  }

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Attendance</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">
          Request location only when you are ready to check in.
        </p>
      </header>

      {isLoadingEvent || registration === undefined ? <p>Loading attendance...</p> : null}
      {!event ? <p>Event not found.</p> : null}
      {event && !registration ? <p>You are not registered for this event.</p> : null}

      {event && registration ? (
        <section className="grid gap-4">
          <h2 className="text-xl font-black">{event.name}</h2>
          <p>{event.locationName}</p>
          <AttendanceMap
            event={{
              latitude: event.latitude,
              longitude: event.longitude,
              radiusMeters: event.radiusMeters,
              locationName: event.locationName,
            }}
            userLocation={
              locationState.location
                ? {
                    ...locationState.location,
                    characterImageUrl: character?.imageUrl,
                  }
                : undefined
            }
          />

          {attendanceRecord ? (
            <AttendanceResult
              result={{
                isPresent: true,
                isInsideRadius: true,
                distanceMeters: attendanceRecord.distanceMeters,
                allowedRadiusMeters: event.radiusMeters,
                checkedInAt: attendanceRecord.checkedInAt,
                message: "Attendance already completed.",
              }}
            />
          ) : null}

          {attendance.result ? <AttendanceResult result={attendance.result} /> : null}
          {locationState.error ? <p role="alert">{locationState.error}</p> : null}
          {attendance.error ? <p role="alert">{attendance.error}</p> : null}

          <button
            className="rounded-md bg-emerald-950 px-4 py-3 font-bold text-white disabled:opacity-60"
            type="button"
            disabled={Boolean(attendanceRecord) || attendance.isSubmitting || locationState.isLoading}
            onClick={() => void handleCheckIn()}
          >
            {attendance.isSubmitting || locationState.isLoading
              ? "Checking location..."
              : "Make Attendance"}
          </button>
        </section>
      ) : null}
    </PixelLayout>
  );
}
