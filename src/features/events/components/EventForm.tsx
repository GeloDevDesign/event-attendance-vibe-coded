import { useState, type FormEvent, type JSX } from "react";
import type { EventFormValues } from "../types/event.types";
import { EventLocationPicker } from "./EventLocationPicker";
import { PixelButton } from "../../../components/PixelButton";

export interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  onSubmit(values: EventFormValues): Promise<void>;
}

function toDateInputValue(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toISOString().slice(0, 10);
}

function toDateTimeLocalInputValue(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

export function EventForm(props: EventFormProps): JSX.Element {
  const [name, setName] = useState(props.initialValues?.name ?? "");
  const [locationName, setLocationName] = useState(
    props.initialValues?.locationName ?? "",
  );
  const [imageUrl, setImageUrl] = useState(props.initialValues?.imageUrl ?? "");
  const [latitude, setLatitude] = useState(props.initialValues?.latitude ?? 14.5995);
  const [longitude, setLongitude] = useState(
    props.initialValues?.longitude ?? 120.9842,
  );
  const [radiusMeters, setRadiusMeters] = useState(
    props.initialValues?.radiusMeters ?? 100,
  );
  const [maximumParticipants, setMaximumParticipants] = useState(
    props.initialValues?.maximumParticipants ?? 10,
  );
  const [eventDate, setEventDate] = useState(
    toDateInputValue(props.initialValues?.eventDate),
  );
  const [attendanceStartAt, setAttendanceStartAt] = useState(
    toDateTimeLocalInputValue(props.initialValues?.attendanceStartAt),
  );
  const [attendanceEndAt, setAttendanceEndAt] = useState(
    toDateTimeLocalInputValue(
      props.initialValues?.attendanceEndAt ?? Date.now() + 60 * 60 * 1000,
    ),
  );
  const [status, setStatus] = useState<EventFormValues["status"]>(
    props.initialValues?.status ?? "open",
  );
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedLocationName = locationName.trim();
    const nextEventDate = new Date(eventDate).getTime();
    const nextAttendanceStartAt = new Date(attendanceStartAt).getTime();
    const nextAttendanceEndAt = new Date(attendanceEndAt).getTime();
    const errors: string[] = [];

    if (!normalizedName) {
      errors.push("Event name is required.");
    }

    if (!normalizedLocationName) {
      errors.push("Location name is required.");
    }

    if (!Number.isFinite(nextEventDate)) {
      errors.push("Event date is required.");
    }

    if (!Number.isFinite(nextAttendanceStartAt)) {
      errors.push("Attendance start is required.");
    }

    if (!Number.isFinite(nextAttendanceEndAt)) {
      errors.push("Attendance end is required.");
    }

    if (
      Number.isFinite(nextAttendanceStartAt) &&
      Number.isFinite(nextAttendanceEndAt) &&
      nextAttendanceEndAt <= nextAttendanceStartAt
    ) {
      errors.push("Attendance end must be after attendance start.");
    }

    if (errors.length > 0) {
      setFormError(errors.join(" "));
      return;
    }

    setFormError(null);
    await props.onSubmit({
      name: normalizedName,
      locationName: normalizedLocationName,
      imageUrl: imageUrl.trim() || undefined,
      latitude,
      longitude,
      radiusMeters,
      maximumParticipants,
      eventDate: nextEventDate,
      attendanceStartAt: nextAttendanceStartAt,
      attendanceEndAt: nextAttendanceEndAt,
      status,
    });
  }

  return (
    <form className="grid gap-6 border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_#000]" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-[12px] text-black">
        <span className="uppercase tracking-wider">EVENT NAME</span>
        <input
          className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label className="grid gap-2 text-[12px] text-black">
        <span className="uppercase tracking-wider">LOCATION NAME</span>
        <input
          className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
          required
          value={locationName}
          onChange={(event) => setLocationName(event.target.value)}
        />
      </label>

      <label className="grid gap-2 text-[12px] text-black">
        <span className="uppercase tracking-wider">IMAGE URL (OPTIONAL)</span>
        <input
          className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="/popup.png"
        />
      </label>

      <div className="border-4 border-black shadow-[4px_4px_0_0_#000]">
        <EventLocationPicker
          latitude={latitude}
          longitude={longitude}
          radiusMeters={radiusMeters}
          onChange={(location) => {
            setLatitude(location.latitude);
            setLongitude(location.longitude);
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">LATITUDE</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            required
            type="number"
            value={latitude}
            onChange={(event) => setLatitude(Number(event.target.value))}
          />
        </label>
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">LONGITUDE</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            required
            type="number"
            value={longitude}
            onChange={(event) => setLongitude(Number(event.target.value))}
          />
        </label>
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">RADIUS METERS</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            min={1}
            required
            type="number"
            value={radiusMeters}
            onChange={(event) => setRadiusMeters(Number(event.target.value))}
          />
        </label>
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">CAPACITY</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            min={1}
            required
            type="number"
            value={maximumParticipants}
            onChange={(event) => setMaximumParticipants(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">EVENT DATE</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            required
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">ATTEND START</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            required
            type="datetime-local"
            value={attendanceStartAt}
            onChange={(event) => setAttendanceStartAt(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">ATTEND END</span>
          <input
            className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
            required
            type="datetime-local"
            value={attendanceEndAt}
            onChange={(event) => setAttendanceEndAt(event.target.value)}
          />
        </label>
      </div>

      <label className="grid gap-2 text-[12px] text-black">
        <span className="uppercase tracking-wider">STATUS</span>
        <select
          className="w-full h-12 border-4 border-black bg-white px-3 text-[12px] text-black outline-none focus:bg-[#fff9c4] shadow-[4px_4px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0_0_#000] transition-all"
          value={status}
          onChange={(event) => setStatus(event.target.value as EventFormValues["status"])}
        >
          <option value="draft">DRAFT</option>
          <option value="open">OPEN</option>
          <option value="ongoing">ONGOING</option>
          <option value="completed">COMPLETED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
      </label>

      {formError ? (
        <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000]" role="alert">
          {formError}
        </p>
      ) : null}

      <PixelButton variant="primary" type="submit" className="w-full mt-4">
        SAVE EVENT
      </PixelButton>
    </form>
  );
}
