import { useState, type FormEvent, type JSX } from "react";
import type { EventFormValues } from "../types/event.types";
import { EventLocationPicker } from "./EventLocationPicker";

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
    <form className="grid gap-5 rounded-lg bg-white p-5 shadow" onSubmit={handleSubmit}>
      <label className="grid gap-1">
        <span className="font-bold">Event name</span>
        <input
          className="rounded-md border border-slate-300 px-3 py-2"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label className="grid gap-1">
        <span className="font-bold">Location name</span>
        <input
          className="rounded-md border border-slate-300 px-3 py-2"
          required
          value={locationName}
          onChange={(event) => setLocationName(event.target.value)}
        />
      </label>

      <EventLocationPicker
        latitude={latitude}
        longitude={longitude}
        radiusMeters={radiusMeters}
        onChange={(location) => {
          setLatitude(location.latitude);
          setLongitude(location.longitude);
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="font-bold">Latitude</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            required
            type="number"
            value={latitude}
            onChange={(event) => setLatitude(Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-bold">Longitude</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            required
            type="number"
            value={longitude}
            onChange={(event) => setLongitude(Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-bold">Radius meters</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            min={1}
            required
            type="number"
            value={radiusMeters}
            onChange={(event) => setRadiusMeters(Number(event.target.value))}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-bold">Capacity</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            min={1}
            required
            type="number"
            value={maximumParticipants}
            onChange={(event) => setMaximumParticipants(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-1">
          <span className="font-bold">Event date</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            required
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-bold">Attendance start</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            required
            type="datetime-local"
            value={attendanceStartAt}
            onChange={(event) => setAttendanceStartAt(event.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span className="font-bold">Attendance end</span>
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            required
            type="datetime-local"
            value={attendanceEndAt}
            onChange={(event) => setAttendanceEndAt(event.target.value)}
          />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="font-bold">Status</span>
        <select
          className="rounded-md border border-slate-300 px-3 py-2"
          value={status}
          onChange={(event) => setStatus(event.target.value as EventFormValues["status"])}
        >
          <option value="draft">Draft</option>
          <option value="open">Open</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      {formError ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-bold text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      <button className="rounded-md bg-emerald-950 px-4 py-3 font-bold text-white" type="submit">
        Save event
      </button>
    </form>
  );
}
