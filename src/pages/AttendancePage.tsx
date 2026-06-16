import { useState, type JSX } from "react";
import { useQuery } from "convex/react";
import { useParams } from "react-router-dom";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { PixelLayout } from "../components/PixelLayout";
import { AttendanceMap } from "../features/attendance-map/components/AttendanceMap";
import { PixelButton } from "../components/PixelButton";
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
  
  const publicRegistrations = useQuery(
    api.attendance.listPublicAttendanceByEvent,
    eventId ? { eventId } : "skip"
  );

  const [showFailureModal, setShowFailureModal] = useState(false);

  async function handleCheckIn() {
    if (!eventId || !registration) {
      return;
    }

    setShowFailureModal(false);

    const location = await locationState.requestLocation();
    if (!location) {
      setShowFailureModal(true);
      return;
    }

    const res = await attendance.submit({
      eventId,
      registrationId: registration.id,
      ...location,
    });

    if (!res || !res.isPresent) {
      setShowFailureModal(true);
    }
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
        <section className="grid gap-6">
          <div className="bg-[#ebd2a9] border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div>
                <h2 className="text-xl text-black mb-2 uppercase">{event.name}</h2>
                <p className="text-[10px] text-stone-700 leading-relaxed">{event.locationName}</p>
              </div>
              <PixelButton variant="secondary" to={`/events/${eventId}`} className="shrink-0 text-[10px] py-2 px-4">
                EVENT DETAILS
              </PixelButton>
            </div>
            
            <div className="border-4 border-black shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <AttendanceMap
                event={{
                  latitude: event.latitude,
                  longitude: event.longitude,
                  radiusMeters: event.radiusMeters,
                  locationName: event.locationName,
                  imageUrl: event.imageUrl,
                }}
                userLocation={
                  locationState.location
                    ? {
                        ...locationState.location,
                        characterImageUrl: character?.imageUrl,
                        isCurrentUser: true,
                      }
                    : undefined
                }
                otherUsers={publicRegistrations
                  ?.filter(reg => reg.userId !== registration?.userId)
                  .map(reg => ({
                    latitude: reg.latitude,
                    longitude: reg.longitude,
                    accuracyMeters: 10,
                    characterImageUrl: reg.characterImageUrl,
                    isCurrentUser: false,
                    firstName: reg.firstName,
                    lastName: reg.lastName,
                  }))}
              />
            </div>
          </div>

          {attendanceRecord ? (
            <div className="bg-emerald-400 border-4 border-black p-6 shadow-[8px_8px_0_0_#000] text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white border-4 border-black shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <h3 className="text-lg text-black uppercase mb-2">Quest Completed</h3>
              <p className="text-[10px] text-black leading-relaxed">
                Distance: {Math.round(attendanceRecord.distanceMeters)}m / Radius: {event.radiusMeters}m
              </p>
              <p className="text-[10px] text-black leading-relaxed mt-2">
                Checked in: {new Date(attendanceRecord.checkedInAt).toLocaleString()}
              </p>
            </div>
          ) : null}

          <PixelButton
            variant="primary"
            disabled={Boolean(attendanceRecord) || attendance.isSubmitting || locationState.isLoading}
            onClick={() => void handleCheckIn()}
            className="w-full h-16 text-lg"
          >
            {attendance.isSubmitting || locationState.isLoading
              ? "SEARCHING..."
              : attendanceRecord 
                ? "ALREADY COMPLETED" 
                : "MARK ATTENDANCE"}
          </PixelButton>
        </section>
      ) : null}

      {/* Loading Modal */}
      {(locationState.isLoading || attendance.isSubmitting) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#ebd2a9] border-4 border-black shadow-[8px_8px_0_0_#000] p-8 max-w-sm w-full text-center">
            <h2 className="text-xl text-black mb-4 uppercase animate-pulse">LOCATING...</h2>
            <p className="text-[10px] text-stone-700 leading-relaxed mb-6">
              Triangulating coordinates and scanning for event radius...
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-sky-200 border-4 border-black shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden">
                <img 
                  src={character?.imageUrl?.replace("_idle.gif", "_walk.gif").replace("_Idle.gif", "_Walk.gif") || "/Characters/Drop_Walk.gif"} 
                  alt="Searching" 
                  className="w-16 h-16 [image-rendering:pixelated] absolute z-10"
                />
                <div className="absolute bottom-0 w-full h-6 bg-emerald-400 border-t-4 border-black"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quest Failed Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-red-400 border-4 border-black shadow-[8px_8px_0_0_#000] p-8 max-w-sm w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white border-4 border-black shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
            </div>
            <h3 className="text-xl text-black uppercase mb-4">QUEST FAILED</h3>
            <p className="text-[10px] text-black leading-relaxed mb-2">
              {attendance.result?.message || locationState.error || attendance.error || "You are too far from the quest location."}
            </p>
            {attendance.result && (
              <p className="text-[10px] text-black leading-relaxed mb-6 font-bold">
                Distance: {Math.round(attendance.result.distanceMeters)}m / Required: {attendance.result.allowedRadiusMeters}m
              </p>
            )}
            <PixelButton 
              variant="secondary" 
              onClick={() => setShowFailureModal(false)}
              className="w-full mt-4"
            >
              CLOSE
            </PixelButton>
          </div>
        </div>
      )}
    </PixelLayout>
  );
}
