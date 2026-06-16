import type { JSX } from "react";
import { Link, useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { PixelLayout } from "../components/PixelLayout";
import { AdminAttendanceMap } from "../features/attendance-map/components/AdminAttendanceMap";
import { useEvent } from "../features/events/hooks/useEvent";

export function AdminEventDetailsPage(): JSX.Element {
  const params = useParams();
  const eventId = params.eventId as Id<"events"> | undefined;
  const { event, isLoading, error } = useEvent(eventId);

  return (
    <PixelLayout maxWidth="max-w-[1100px]">
      <header className="mb-6">
        <h1 className="text-2xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Event Details</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">
          Admin attendance map and attendee characters.
        </p>
      </header>
      {isLoading ? <p>Loading event...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!isLoading && !event ? <p>Event not found.</p> : null}
      {event ? (
        <section className="grid gap-5">
          <div className="rounded-md border-4 border-black bg-white p-4">
            <h2 className="text-xl font-black">{event.name}</h2>
            <p>{event.locationName}</p>
            <p>Status: {event.status}</p>
            <p>Radius: {event.radiusMeters}m</p>
          </div>
          <AdminAttendanceMap
            eventId={event.id}
            event={{
              latitude: event.latitude,
              longitude: event.longitude,
              radiusMeters: event.radiusMeters,
              locationName: event.locationName,
            }}
          />
          <Link
            className="rounded-md bg-emerald-950 px-4 py-3 text-center font-bold text-white"
            to="/admin/events"
          >
            Back to admin events
          </Link>
        </section>
      ) : null}
    </PixelLayout>
  );
}
