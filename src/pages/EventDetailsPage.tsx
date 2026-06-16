import type { JSX } from "react";
import { Link, useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { PixelLayout } from "../components/PixelLayout";
import { AttendanceMap } from "../features/attendance-map/components/AttendanceMap";
import { useEvent } from "../features/events/hooks/useEvent";

export function EventDetailsPage(): JSX.Element {
  const params = useParams();
  const eventId = params.eventId as Id<"events"> | undefined;
  const { event, isLoading, error } = useEvent(eventId);

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Event Details</h1>
      </header>
      {isLoading ? <p>Loading event...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!isLoading && !event ? <p>Event not found.</p> : null}
      {event ? (
        <section className="grid gap-4">
          <h2 className="text-xl font-black">{event.name}</h2>
          <p>{event.locationName}</p>
          <p>Status: {event.status}</p>
          <p>Attendance: {new Date(event.attendanceStartAt).toLocaleString()} - {new Date(event.attendanceEndAt).toLocaleString()}</p>
          <AttendanceMap
            event={{
              latitude: event.latitude,
              longitude: event.longitude,
              radiusMeters: event.radiusMeters,
              locationName: event.locationName,
            }}
          />
          {event.status === "open" ? (
            <Link
              className="rounded-md bg-emerald-950 px-4 py-3 text-center font-bold text-white"
              to={`/events/${event.id}/register`}
            >
              Register
            </Link>
          ) : null}
        </section>
      ) : null}
    </PixelLayout>
  );
}
