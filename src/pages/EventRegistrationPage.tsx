import { useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";

import { useEventRegistration } from "../features/registrations/hooks/useEventRegistration";
import { useAuthentication } from "../features/authentication/hooks/useAuthentication";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { PixelLayout } from "../components/PixelLayout";
import { PixelButton } from "../components/PixelButton";

export interface EventRegistrationPageProps {
  eventId?: Id<"events">;
  eventName?: string;
}

export function EventRegistrationPage(
  props: EventRegistrationPageProps = {},
): JSX.Element {
  const params = useParams();
  const eventId = props.eventId ?? (params.eventId as Id<"events"> | undefined);
  const { isSubmitting, error: submitError, submit } = useEventRegistration({
    eventId,
  });
  const { user } = useAuthentication();
  const existingRegistration = useQuery(
    api.registrations.getRegistrationByEventAndUser,
    eventId ? { eventId } : "skip"
  );
  const [pageMessage, setPageMessage] = useState<string | null>(null);

  async function handleJoin() {
    const registration = await submit();
    if (registration) {
      setPageMessage(`Joined successfully as ${registration.firstName} ${registration.lastName}!`);
    }
  }

  if (!eventId) {
    return (
      <PixelLayout>
        <p className="text-[10px] text-red-500">Select an event before registering.</p>
      </PixelLayout>
    );
  }

  return (
    <PixelLayout maxWidth="max-w-[600px]">
      <div className="bg-[#ebd2a9] border-4 border-black p-8 shadow-[10px_10px_0_0_#000] text-center">
        <h1 className="text-3xl text-black mb-4 uppercase drop-shadow-[2px_2px_0_#fff]">Join Quest</h1>
        
        {user?.selectedCharacterImageUrl && (
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 border-4 border-black bg-white shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <img 
                src={user.selectedCharacterImageUrl} 
                alt="Selected Character" 
                className="w-16 h-16 [image-rendering:pixelated]"
              />
            </div>
          </div>
        )}

        <p className="text-[12px] text-stone-700 leading-relaxed mb-8">
          You will automatically join this event using your active Hero and Profile Name.
        </p>
        
        {existingRegistration ? (
          <div className="border-4 border-black bg-emerald-400 px-4 py-4 shadow-[4px_4px_0_0_#000] mb-6">
            <p className="text-[12px] leading-relaxed text-black text-center font-black">
              ALREADY JOINED!
            </p>
            <PixelButton variant="primary" to={`/events/${eventId}/attendance`} className="mt-4 w-full">
              GO TO QUEST
            </PixelButton>
          </div>
        ) : pageMessage ? (
          <div className="border-4 border-black bg-[#3db5e6] px-4 py-4 shadow-[4px_4px_0_0_#000] mb-6">
            <p className="text-[12px] leading-relaxed text-white text-center">
              {pageMessage}
            </p>
            <PixelButton variant="primary" to="/events" className="mt-4 w-full">
              VIEW MY QUESTS
            </PixelButton>
          </div>
        ) : (
          <div className="grid gap-4">
            {submitError ? (
              <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000]" role="alert">
                {submitError}
              </p>
            ) : null}
            <div className="flex gap-4">
              <PixelButton variant="secondary" to="/events" className="flex-1">
                CANCEL
              </PixelButton>
              <PixelButton 
                variant="primary" 
                onClick={() => void handleJoin()} 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "JOINING..." : "CONFIRM JOIN"}
              </PixelButton>
            </div>
          </div>
        )}
      </div>
    </PixelLayout>
  );
}
