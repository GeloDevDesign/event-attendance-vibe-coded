import type { JSX } from "react";
import { RegistrationStatusBadge } from "./RegistrationStatusBadge";
import type { JoinedEventRecord } from "../types/registration.types";
import { PixelButton } from "../../../components/PixelButton";

export interface RegistrationCardProps {
  registration: JoinedEventRecord;
}

export function RegistrationCard(props: RegistrationCardProps): JSX.Element {
  const { registration } = props;

  return (
    <article className="grid gap-3 border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
      {registration.eventImageUrl ? (
        <div className="border-4 border-black bg-[#111] overflow-hidden flex items-center justify-center h-32 mb-2">
          <img src={registration.eventImageUrl} alt={registration.eventName} className="w-full h-full object-cover [image-rendering:pixelated]" />
        </div>
      ) : null}
      <header>
        <RegistrationStatusBadge isAccepted={registration.isAccepted} />
        <h3 className="text-xl text-black uppercase drop-shadow-[1px_1px_0_#fff] mt-2">{registration.eventName}</h3>
      </header>
      <p className="text-[10px] text-stone-600 leading-relaxed uppercase">{registration.locationName}</p>
      <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-[#ebd2a9] border-4 border-black shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-[8px] text-stone-600 mb-1">HERO</p>
          <p className="text-[10px] text-black">{registration.characterName}</p>
        </div>
        <div>
          <p className="text-[8px] text-stone-600 mb-1">PLAYER</p>
          <p className="text-[10px] text-black">{registration.firstName} {registration.lastName}</p>
        </div>
      </div>
      <p className="text-[10px] text-stone-600 leading-relaxed">
        {new Date(registration.eventDate).toLocaleDateString()}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        <PixelButton
          variant="secondary"
          to={`/events/${registration.eventId}`}
          className="!w-auto !min-h-[40px] !px-4"
        >
          VIEW
        </PixelButton>
        <PixelButton
          variant="primary"
          to={`/events/${registration.eventId}/attendance`}
          className="!w-auto !min-h-[40px] !px-4"
        >
          ATTEND
        </PixelButton>
      </div>
    </article>
  );
}
