import type { JSX } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { PixelLayout } from "../components/PixelLayout";
import { AttendanceMap } from "../features/attendance-map/components/AttendanceMap";
import { useEvent } from "../features/events/hooks/useEvent";
import { PixelButton } from "../components/PixelButton";

export function EventDetailsPage(): JSX.Element {
  const params = useParams();
  const eventId = params.eventId as Id<"events"> | undefined;
  const { event, isLoading, error } = useEvent(eventId);
  
  const existingRegistration = useQuery(
    api.registrations.getRegistrationByEventAndUser,
    eventId ? { eventId } : "skip"
  );

  return (
    <PixelLayout maxWidth="max-w-[980px]">
      <div className="bg-[#ebd2a9] border-4 border-black p-5 shadow-[10px_10px_0_0_#000]">
        <header className="mb-4">
          <h1 className="text-2xl font-black text-black uppercase">Event Details</h1>
          <p className="text-[10px] text-stone-700 mt-1">View the event map and your active quest details.</p>
        </header>

        {isLoading ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">Loading event...</p> : null}
        {error ? <p className="text-[10px] border-4 border-black bg-red-500 text-white p-4 shadow-[4px_4px_0_0_#000]" role="alert">{error}</p> : null}
        {!isLoading && !event ? <p className="text-[10px] border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">Event not found.</p> : null}
        
        {event ? (
          <section className="grid gap-4">
            <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
              <h2 className="text-lg font-black text-black">{event.name}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                <p className="text-[10px] text-stone-500 mb-1 flex items-center gap-1 uppercase font-bold">
                  <span className="text-blue-500 text-sm">📍</span> Location
                </p>
                <p className="text-[12px] text-black leading-tight">{event.locationName}</p>
              </div>
              <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                <p className="text-[10px] text-stone-500 mb-1 flex items-center gap-1 uppercase font-bold">
                  <span className="text-emerald-500 text-sm">🟢</span> Status
                </p>
                <p className="text-[12px] text-black leading-tight">Status: <span className="text-emerald-600">{event.status}</span></p>
              </div>
              <div className="border-4 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
                <p className="text-[10px] text-stone-500 mb-1 flex items-center gap-1 uppercase font-bold">
                  <span className="text-rose-500 text-sm">◎</span> Radius
                </p>
                <p className="text-[12px] text-black leading-tight">Radius: {event.radiusMeters}m</p>
              </div>
            </div>

            <AttendanceMap
              event={{
                latitude: event.latitude,
                longitude: event.longitude,
                radiusMeters: event.radiusMeters,
                locationName: event.locationName,
                imageUrl: event.imageUrl,
              }}
            />

            <div className="flex gap-4">
              <PixelButton
                variant="secondary"
                className="!flex-1"
                to="/events"
              >
                BACK
              </PixelButton>
              {existingRegistration ? (
                <PixelButton
                  variant="primary"
                  className="!flex-1"
                  to={`/events/${event.id}/attendance`}
                >
                  VIEW QUEST
                </PixelButton>
              ) : event.status === "open" ? (
                <PixelButton
                  variant="primary"
                  className="!flex-1"
                  to={`/events/${event.id}/register`}
                >
                  JOIN EVENT
                </PixelButton>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </PixelLayout>
  );
}
