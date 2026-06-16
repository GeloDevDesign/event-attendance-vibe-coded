# Feature Scaffold Plan

## Project

EventQuest Attendance

## Purpose

This document defines the initial project scaffold for the EventQuest Attendance application.

The scaffold must create structure, file names, public interfaces, types, and test placeholders only. It must not contain production business logic.

## Required References

Before creating the scaffold, read:

- `AGENTS.md` or `CODEX.md`
- `docs/plans/event-attendance-plan.md`
- `docs/plans/database-schema-plan.md`
- `convex/_generated/ai/guidelines.md`

## Scaffold Rules

- Create only files required by the approved plans.
- Do not add new architecture patterns.
- Do not install packages without approval.
- Do not implement attendance validation in the scaffold stage.
- Do not modify unrelated files.
- Use auto-edit only for safe new scaffold files.
- Use suggest mode for changes to existing files.
- Keep all public functions strictly typed.
- Add test file placeholders for every feature.
- Keep naming consistent with React, TypeScript, and Convex conventions.

## Project Structure

In this repository, the agent instructions file is located at `.agents/agents.md`.

```text
project-root/
├── AGENTS.md
├── CODEX.md
├── docs/
│   ├── plans/
│   │   ├── event-attendance-plan.md
│   │   ├── database-schema-plan.md
│   │   ├── feature-scaffold-plan.md
│   │   └── implementation-plan.md
│   ├── agents/
│   │   └── agents.md
│   ├── testing/
│   └── standards/
├── src/
│   ├── features/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── types/
├── convex/
│   ├── schema.ts
│   ├── users.ts
│   ├── events.ts
│   ├── characters.ts
│   ├── registrations.ts
│   ├── attendance.ts
│   └── _generated/
└── public/
    └── characters/
```

## Frontend Scaffold

## 1. Authentication Feature

```text
src/features/authentication/
├── components/
│   ├── LoginForm.tsx
│   └── RegisterAccountForm.tsx
├── hooks/
│   └── useAuthentication.ts
├── services/
│   └── authenticationService.ts
├── types/
│   └── authentication.types.ts
└── __tests__/
    ├── LoginForm.test.tsx
    └── RegisterAccountForm.test.tsx
```

### Public Interfaces

```ts
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterAccountFormValues {
  name: string;
  email: string;
  password: string;
}

export function LoginForm(): JSX.Element;
export function RegisterAccountForm(): JSX.Element;
export function useAuthentication(): UseAuthenticationResult;
```

## 2. Events Feature

```text
src/features/events/
├── components/
│   ├── EventCard.tsx
│   ├── EventForm.tsx
│   ├── EventList.tsx
│   ├── EventStatusBadge.tsx
│   └── EventLocationPicker.tsx
├── hooks/
│   ├── useEvents.ts
│   ├── useEvent.ts
│   └── useEventForm.ts
├── services/
│   └── eventService.ts
├── types/
│   └── event.types.ts
└── __tests__/
    ├── EventForm.test.tsx
    ├── EventList.test.tsx
    └── EventLocationPicker.test.tsx
```

### Shared Event Types

These frontend scaffold types should import Convex `Id` types for document references.

```ts
export type EventStatus =
  | "draft"
  | "open"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface EventRecord {
  id: Id<"events">;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maximumParticipants: number;
  eventDate: number;
  attendanceStartAt: number;
  attendanceEndAt: number;
  status: EventStatus;
  createdBy: Id<"users">;
  createdAt: number;
  updatedAt: number;
}

export interface EventFormValues {
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maximumParticipants: number;
  eventDate: number;
  attendanceStartAt: number;
  attendanceEndAt: number;
  status: EventStatus;
}
```

### Public Component Interfaces

```ts
export interface EventCardProps {
  event: EventRecord;
}

export interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  onSubmit(values: EventFormValues): Promise<void>;
}

export function EventCard(props: EventCardProps): JSX.Element;
export function EventForm(props: EventFormProps): JSX.Element;
export function EventList(): JSX.Element;
export function EventLocationPicker(): JSX.Element;
```

## 3. Characters Feature

```text
src/features/characters/
├── components/
│   ├── CharacterCard.tsx
│   ├── CharacterGrid.tsx
│   ├── CharacterForm.tsx
│   └── CharacterSelector.tsx
├── hooks/
│   └── useCharacters.ts
├── services/
│   └── characterService.ts
├── types/
│   └── character.types.ts
└── __tests__/
    ├── CharacterGrid.test.tsx
    └── CharacterSelector.test.tsx
```

### Shared Character Types

```ts
export interface CharacterRecord {
  id: Id<"characters">;
  name: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CharacterSelectorProps {
  characters: CharacterRecord[];
  selectedCharacterId?: Id<"characters">;
  onSelect(characterId: Id<"characters">): void;
}
```

## 4. Registrations Feature

```text
src/features/registrations/
├── components/
│   ├── EventRegistrationForm.tsx
│   ├── RegistrationCard.tsx
│   ├── RegistrationList.tsx
│   └── RegistrationStatusBadge.tsx
├── hooks/
│   ├── useEventRegistration.ts
│   └── useJoinedEvents.ts
├── services/
│   └── registrationService.ts
├── types/
│   └── registration.types.ts
└── __tests__/
    ├── EventRegistrationForm.test.tsx
    └── RegistrationList.test.tsx
```

### Shared Registration Types

```ts
export interface EventRegistrationRecord {
  id: Id<"eventRegistrations">;
  eventId: Id<"events">;
  userId: Id<"users">;
  characterId: Id<"characters">;
  firstName: string;
  lastName: string;
  isAccepted: boolean;
  registeredAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface RegistrationFormValues {
  firstName: string;
  lastName: string;
  characterId: Id<"characters">;
}

export interface EventRegistrationFormProps {
  eventId: Id<"events">;
  onSuccess(registration: EventRegistrationRecord): void;
}
```

## 5. Attendance Feature

```text
src/features/attendance/
├── components/
│   ├── AttendanceButton.tsx
│   ├── AttendanceCountdown.tsx
│   ├── AttendanceResult.tsx
│   ├── AttendanceStatusBadge.tsx
│   └── LocationPermissionState.tsx
├── hooks/
│   ├── useAttendance.ts
│   ├── useAttendanceCountdown.ts
│   └── useAttendanceStatus.ts
├── services/
│   ├── attendanceService.ts
│   └── distanceService.ts
├── types/
│   └── attendance.types.ts
└── __tests__/
    ├── AttendanceButton.test.tsx
    ├── AttendanceCountdown.test.tsx
    ├── AttendanceResult.test.tsx
    └── distanceService.test.ts
```

### Shared Attendance Types

```ts
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface BrowserLocation extends Coordinate {
  accuracyMeters: number;
}

export interface AttendanceRecord {
  id: Id<"attendanceRecords">;
  eventId: Id<"events">;
  registrationId: Id<"eventRegistrations">;
  userId: Id<"users">;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  distanceMeters: number;
  isInsideRadius: boolean;
  isPresent: true;
  checkedInAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface AttendanceAttemptInput extends BrowserLocation {
  eventId: Id<"events">;
  registrationId: Id<"eventRegistrations">;
}

export interface AttendanceResultData {
  isPresent: boolean;
  isInsideRadius: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
  checkedInAt?: number;
  message: string;
}
```

### Public Interfaces

```ts
export interface AttendanceButtonProps {
  eventId: Id<"events">;
  registrationId: Id<"eventRegistrations">;
  disabled?: boolean;
}

export interface AttendanceCountdownProps {
  startsAt: number;
  endsAt: number;
}

export function AttendanceButton(
  props: AttendanceButtonProps
): JSX.Element;

export function AttendanceCountdown(
  props: AttendanceCountdownProps
): JSX.Element;
```

## 6. Attendance Map Feature

```text
src/features/attendance-map/
├── components/
│   ├── AttendanceMap.tsx
│   ├── AdminAttendanceMap.tsx
│   ├── AttendeeCharacterMarker.tsx
│   ├── EventMarker.tsx
│   ├── EventRadiusCircle.tsx
│   ├── DistanceLine.tsx
│   ├── AttendanceMapLegend.tsx
│   └── AttendeePopup.tsx
├── hooks/
│   ├── useLeafletMap.ts
│   ├── useAttendeeMapData.ts
│   └── useSelectedAttendee.ts
├── services/
│   ├── mapService.ts
│   └── locationIqService.ts
├── types/
│   └── attendance-map.types.ts
└── __tests__/
    ├── AttendanceMap.test.tsx
    ├── AdminAttendanceMap.test.tsx
    ├── AttendeeCharacterMarker.test.tsx
    └── locationIqService.test.ts
```

### Shared Map Types

```ts
export interface MapAttendee {
  registrationId: Id<"eventRegistrations">;
  userId: Id<"users">;
  attendeeName: string;
  characterName: string;
  characterImageUrl: string;
  isPresent: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  distanceMeters: number | null;
  checkedInAt: number | null;
}

export interface EventMapLocation {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  locationName: string;
}

export interface AttendanceMapProps {
  event: EventMapLocation;
  attendee?: MapAttendee;
}

export interface AdminAttendanceMapProps {
  eventId: Id<"events">;
}
```

## Shared Components

```text
src/components/
├── Button.tsx
├── FormField.tsx
├── LoadingState.tsx
├── EmptyState.tsx
├── ErrorState.tsx
├── PageHeader.tsx
├── StatusBadge.tsx
└── ConfirmDialog.tsx
```

## Shared Hooks

```text
src/hooks/
├── useCurrentLocation.ts
├── useCountdown.ts
└── useDocumentTitle.ts
```

### Public Hook Interfaces

```ts
export interface CurrentLocationState {
  location: BrowserLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation(): Promise<void>;
}

export function useCurrentLocation(): CurrentLocationState;
```

## Shared Services

```text
src/services/
├── locationService.ts
├── dateTimeService.ts
└── validationService.ts
```

## Shared Types

```text
src/types/
├── api.types.ts
├── common.types.ts
└── user.types.ts
```

## Route-Level Pages

```text
src/pages/
├── LoginPage.tsx
├── RegisterAccountPage.tsx
├── AvailableEventsPage.tsx
├── JoinedEventsPage.tsx
├── EventDetailsPage.tsx
├── EventRegistrationPage.tsx
├── AttendancePage.tsx
├── AttendanceResultPage.tsx
├── AdminDashboardPage.tsx
├── AdminEventsPage.tsx
├── AdminCreateEventPage.tsx
├── AdminEventDetailsPage.tsx
├── AdminRegistrationsPage.tsx
├── AdminCharactersPage.tsx
└── AdminAttendanceMapPage.tsx
```

## Suggested Routes

```text
/login
/register
/events
/events/:eventId
/events/:eventId/register
/events/:eventId/attendance
/events/:eventId/attendance/result
/joined-events

/admin
/admin/events
/admin/events/create
/admin/events/:eventId
/admin/events/:eventId/registrations
/admin/events/:eventId/attendance
/admin/characters
```

## Convex Scaffold

Before editing Convex files, read:

```text
convex/_generated/ai/guidelines.md
```

## Schema File

```text
convex/schema.ts
```

The schema scaffold should define:

- `users`
- `events`
- `characters`
- `eventRegistrations`
- `attendanceRecords`

The scaffold should include validators and indexes from the database schema plan, but no application mutations or queries.

Use Convex-style multi-field index names such as `by_eventId_and_userId`.

## Convex Module Files

```text
convex/
├── users.ts
├── events.ts
├── characters.ts
├── registrations.ts
├── attendance.ts
└── mapData.ts
```

## Required Convex Function Signatures

The exact syntax must follow the generated Convex guidelines.

### `users.ts`

```ts
getCurrentUser();
getUserRole();
```

### `events.ts`

```ts
listOpenEvents();
listAllEvents();
getEventById(args);
createEvent(args);
updateEvent(args);
changeEventStatus(args);
getEventRegistrationCount(args);
```

### `characters.ts`

```ts
listActiveCharacters();
listAllCharacters();
createCharacter(args);
updateCharacter(args);
setCharacterActiveState(args);
```

### `registrations.ts`

```ts
registerForEvent(args);
getRegistrationByEventAndUser(args);
listRegistrationsByEvent(args);
listJoinedEvents();
getRegistrationCountByEvent(args);
```

### `attendance.ts`

```ts
checkInAttendance(args);
getAttendanceByRegistration(args);
listAttendanceByEvent(args);
getAttendanceStatistics(args);
```

### `mapData.ts`

```ts
getAdminAttendanceMapData(args);
getUserAttendanceMapData(args);
```

## Convex Test Scaffold

```text
convex/__tests__/
├── events.test.ts
├── characters.test.ts
├── registrations.test.ts
├── attendance.test.ts
└── mapData.test.ts
```

## Required Test Placeholders

### Events

- Create event successfully.
- Reject invalid coordinates.
- Reject invalid radius.
- Reject invalid attendance schedule.
- Reject non-admin event creation.

### Registrations

- Register successfully.
- Automatically set `isAccepted = true`.
- Reject duplicate registration.
- Reject registration when event is full.
- Reject registration when event is not open.
- Reject inactive character selection.

### Attendance

- Accept attendance inside radius.
- Accept exact radius boundary.
- Reject attendance outside radius.
- Reject before attendance start time.
- Reject after attendance end time.
- Reject unregistered user.
- Reject unaccepted registration.
- Reject duplicate successful attendance.
- Reject concurrent duplicate successful attendance.
- Ignore client-provided distance.
- Prevent one user from checking in another registration.

### Real-Time Map

- Return all registered attendees.
- Return coordinates only for Present attendees.
- Return Not Present attendees with null location values.
- Update statistics after successful attendance.

## Scaffold Completion Checklist

- Folder structure matches the approved React structure.
- No new architecture pattern was introduced.
- All required pages are scaffolded.
- All required features are scaffolded.
- Shared types are defined.
- Convex schema collections are scaffolded.
- Convex function signatures are listed.
- Unit and feature test placeholders exist.
- No production business logic was added.
- No package was installed without approval.
- Existing files were not changed without suggest-mode review.
