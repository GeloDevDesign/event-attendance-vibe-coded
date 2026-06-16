# EventQuest Attendance

## Project Overview

EventQuest Attendance is a web-based event registration and GPS attendance system with pixel-art or modern 2D character markers.

Administrators can create events, define an event location and attendance radius, set the event schedule and maximum participants, view registered users, and monitor attendance on a real-time map.

Public users can create an account, register for multiple events, select a character for each registration, view joined events, grant location access, and check in when they are inside the allowed event radius.

The project is a workshop demo intended for approximately 10 attendees per event.

## Stack

- Frontend: React with TypeScript
- Backend and database: Convex
- Map tiles and map rendering: OpenStreetMap with Leaflet.js
- Geocoding and reverse geocoding: LocationIQ
- Platform: Web application

Do not introduce another framework, state-management library, architecture pattern, or backend service unless explicitly approved.

## Convex Guidelines

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what may have been learned about Convex from training data.

Convex agent skills for common tasks can be installed by running:

```bash
npx convex ai-files install
```

Rules:

- Read `convex/_generated/ai/guidelines.md` before creating or modifying Convex code.
- Follow the generated Convex guidelines over generic assumptions.
- Do not install Convex agent skills without explicit approval.
- Do not modify files inside `convex/_generated/` unless the Convex tooling generates them.
- Do not manually recreate generated Convex types or API files.
- Keep Convex queries, mutations, actions, schema definitions, and validators consistent with the generated guidelines.

## Frontend Structure

Use the following React structure:

```text
src/
├── features/
├── components/
├── pages/
├── hooks/
├── services/
└── types/
```

### `features/`

Contains code grouped by business feature.

Expected features:

```text
features/
├── authentication/
├── events/
├── characters/
├── registrations/
├── attendance/
└── attendance-map/
```

A feature may contain its own components, hooks, services, types, validation, and tests.

### `components/`

Contains shared and reusable UI components only.

Examples:

- Buttons
- Forms
- Dialogs
- Status badges
- Loading states
- Empty states
- Character avatars
- Map legends

Do not place feature-specific business rules inside shared components.

### `pages/`

Contains route-level pages.

Pages should compose features and shared components. Do not place complex attendance validation, distance calculations, or database operations directly inside pages.

### `hooks/`

Contains reusable React hooks.

Examples:

- Authentication
- Browser geolocation
- Countdown timer
- Event registration
- Attendance status
- Real-time attendance subscriptions

### `services/`

Contains reusable application services and external integrations.

Examples:

- Event operations
- Registration operations
- Attendance operations
- Character operations
- Map operations

### `types/`

Contains shared TypeScript types and interfaces.

Examples:

- Event
- Character
- EventRegistration
- AttendanceRecord
- Coordinate
- AttendanceStatus

## Application Roles

### Admin

The admin can:

- Log in
- Create and view events
- View all registrations
- View accepted and unaccepted registrations
- View attendance status
- View all attendee characters on the real-time map
- View attendee name, distance, GPS accuracy, check-in time, and attendance status

### Public User

The public user can:

- Create an account
- Log in
- View available events
- Register for multiple events
- Enter first name and last name during registration
- Select a character for each event registration
- View joined events
- Grant browser location permission
- View the event map and radius
- View their character and current location on the map
- View the line and distance between their location and the event
- Attempt attendance check-in

## Core Features

- Authentication
- Admin dashboard
- Event management
- Character selection
- Event registration
- Attendance countdown
- Browser location access
- Server-side distance validation
- User attendance map
- Admin real-time attendance map
- Attendance statistics

## Event Rules

Each event must support:

```text
name
latitude
longitude
radiusMeters
maximumParticipants
eventDate
attendanceStartAt
attendanceEndAt
status
createdBy
createdAt
updatedAt
```

Supported event statuses:

```text
draft
open
ongoing
completed
cancelled
```

Rules:

- Registration is allowed only when the event is open.
- Registration closes automatically when maximum capacity is reached.
- Completed and cancelled events cannot accept new registrations.
- Attendance is allowed only during the configured attendance period.
- Event location and radius must be validated before saving.
- Store `attendanceStartAt` and `attendanceEndAt` as UTC Unix timestamps in milliseconds.
- `eventDate` is for display and filtering only. Attendance availability must use `attendanceStartAt` and `attendanceEndAt`.

## Character Rules

Each character must support:

```text
name
imageUrl
isActive
createdAt
updatedAt
```

Rules:

- Characters use transparent pixel-art or modern 2D images.
- Character selection belongs to the event registration, not permanently to the user.
- A user may select a different character for each event.
- Multiple users may select the same character unless a later requirement changes this rule.
- Character markers must be anchored from the bottom so they appear to stand on the map.

## Registration Rules

Each event registration must support:

```text
eventId
userId
characterId
firstName
lastName
isAccepted
registeredAt
createdAt
updatedAt
```

Rules:

- A user may register for multiple events.
- A user may register only once for the same event.
- New registrations are automatically accepted.
- Store automatic approval using `isAccepted = true`.
- Keep the `isAccepted` field so manual approval can be added later.
- Registration must fail when the event is full.
- Registration must fail when the event is not open.
- Character selection must be stored per registration.

## Attendance Rules

Each successful attendance record must support:

```text
eventId
registrationId
userId
latitude
longitude
accuracyMeters
distanceMeters
isInsideRadius
isPresent
checkedInAt
createdAt
updatedAt
```

User-facing statuses:

```text
Present
Not Present
```

Rules:

- The user must be authenticated.
- The user must be registered for the event.
- The registration must be accepted.
- Attendance must occur within the configured attendance period.
- Location permission must be requested before checking attendance.
- Latitude, longitude, and GPS accuracy must be captured.
- The server must calculate the final distance.
- Attendance succeeds only when the server-calculated distance is within the event radius.
- A successful check-in changes the user to Present.
- An unsuccessful check-in keeps the user as Not Present.
- Users outside the radius may retry while attendance remains open.
- Only one successful attendance record is allowed per registration.
- Continuous location tracking is not allowed after check-in.
- Store only successful attendance records in `attendanceRecords` for the initial workshop demo.
- Derive Not Present from accepted registrations that do not have a successful attendance record.
- Attendance is valid when `now >= attendanceStartAt` and `now <= attendanceEndAt`.
- Duplicate successful check-ins must be prevented even when concurrent requests are submitted.
- GPS accuracy must be captured and shown to the user and admin. It is informational unless a later requirement adds a rejection threshold.

## Map and Location Services

Use:

- OpenStreetMap for map tiles
- Leaflet.js for rendering maps, markers, circles, polylines, popups, and character markers
- LocationIQ for geocoding and reverse geocoding

LocationIQ is used to:

- Convert a searched place or address into latitude and longitude
- Convert latitude and longitude into a readable location
- Assist the admin when selecting an event location

Store only the selected event coordinates and necessary readable location information. Do not depend on the geocoding response as the source of truth for attendance distance validation.

Keep the LocationIQ API key in environment configuration. Never place it directly in frontend source code or commit it to version control.

## Map Rules

The attendance map must support:

- Event marker
- Attendance-radius circle
- User character marker
- Admin view of all attendee character markers
- Line between event and selected attendee
- Distance in meters
- GPS accuracy
- Attendance status
- Attendee name
- Check-in time
- Real-time attendance updates

For the workshop demo:

- Support approximately 10 attendees per event.
- Show all attendee characters directly on the map.
- Do not add clustering unless explicitly requested.
- A small visual offset may be used to make overlapping characters clickable.
- Do not change the stored GPS coordinates when applying a visual offset.
- Initialize the map only once per mounted map view.
- Clean up map instances and subscriptions when components unmount.

## Naming Conventions

### React and TypeScript

- Components: `PascalCase`
- Component files: `PascalCase.tsx`
- Hooks: `useCamelCase`
- Hook files: `useCamelCase.ts`
- Variables and functions: `camelCase`
- Types and interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Boolean fields: prefix with `is`, `has`, `can`, or `should`

Examples:

```text
EventRegistrationForm
useCurrentLocation
attendanceStatus
EventRegistration
MAX_LOCATION_ACCURACY
isAccepted
isPresent
```

### Convex

- Collections: plural camelCase nouns
- Fields: camelCase
- References: use descriptive names ending in `Id`
- Mutations and queries: descriptive camelCase action names
- Validation schemas must match stored data exactly
- Use Convex `Id<"tableName">` types instead of plain strings for Convex-facing ids and function signatures
- Multi-field index names must use `by_field1_and_field2` style

Examples:

```text
users
events
characters
eventRegistrations
attendanceRecords

eventId
userId
characterId
createEvent
registerForEvent
checkInAttendance
by_eventId_and_userId
```

### Routes

Use lowercase kebab-case.

Examples:

```text
/admin/events
/admin/events/create
/admin/events/:eventId/attendance
/events/:eventId
/events/:eventId/register
/events/:eventId/attendance
```

## Testing Standards

Every implemented feature must include appropriate unit or feature tests.

### Unit Tests

Use unit tests for isolated logic such as:

- Distance calculation
- Radius boundary result
- Countdown calculation
- Event capacity calculation
- Coordinate validation
- GPS accuracy validation
- Attendance status conversion
- Map data transformation

### Feature Tests

Use feature tests for complete user behavior such as:

- Admin creates an event.
- User registers for an event.
- Registration is automatically accepted.
- User selects a character per registration.
- Duplicate registration is rejected.
- Registration fails when capacity is full.
- User cannot attend before the start time.
- User cannot attend after the end time.
- Unregistered users cannot check in.
- Unaccepted registrations cannot check in.
- Attendance succeeds inside the radius.
- Attendance fails outside the radius.
- Attendance succeeds exactly on the radius boundary.
- Client-provided distance is ignored.
- Duplicate successful attendance is rejected.
- Concurrent duplicate successful attendance is rejected.
- Successful attendance appears on the admin map.
- Real-time attendance totals update correctly.

Map tests should verify application behavior and mock Leaflet, OpenStreetMap tile loading, and LocationIQ requests where practical.

## Optimization Rules

Optimization is required, but it must remain appropriate for a small workshop demo.

- Avoid unnecessary React re-renders.
- Avoid duplicate Convex queries and subscriptions.
- Avoid repeated map initialization.
- Reuse shared components, hooks, services, and types.
- Keep location access limited to the attendance attempt.
- Do not introduce premature abstractions.
- Do not add complex caching or scaling systems without a clear need.
- Prefer maintainable code over unnecessary optimization.

## Codex Approval Rules

Use auto-edit only for safe scaffold operations:

- Creating new empty folders
- Creating new empty files
- Creating component skeletons
- Creating type definitions
- Creating function signatures
- Creating test file skeletons

Use suggest mode for:

- Business logic
- Attendance validation
- Existing file changes
- Authentication
- Authorization
- Database changes
- Location handling
- Map integration
- Refactoring

## Manual Approval Required

Codex must request explicit approval before:

- Database reset
- Migration rollback
- File deletion
- Git push
- Package installation or removal
- Environment variable changes
- Authentication configuration changes
- Public function signature changes
- Existing file renaming
- Database field removal
- Major folder restructuring

<!-- ## Prompt Requirements

Every implementation prompt must include:

- Role
- Context
- Exact task
- Expected format
- Scope constraints
- Testing requirements
- Optimization requirements
- Verification steps

Default role:

```text
You are a senior frontend developer specializing in React and TypeScript.
```

For Convex or attendance validation tasks:

```text
You are a senior full-stack developer specializing in React, TypeScript, and Convex.
```

Every prompt must require:

- Follow this CODEX.md.
- Follow the approved feature plan.
- Modify only required files.
- Do not refactor unrelated modules.
- Do not change public interfaces without approval.
- Do not add packages without approval.
- Do not introduce a new architecture pattern.
- Maintain strict TypeScript typing.
- Avoid `any` unless unavoidable and documented.
- Add or update unit or feature tests.
- Optimize only within the requested scope.
- Handle loading, empty, error, and success states.
- Report conflicts instead of guessing. -->

## Never Do

- Never validate attendance only on the frontend.
- Never trust a distance submitted by the browser.
- Never trust a client-provided attendance status.
- Never mark attendance as Present without server-side validation.
- Never allow attendance for an unregistered user.
- Never allow attendance outside the configured time.
- Never create duplicate successful attendance records.
- Never accept a client-provided user identity for authorization.
- Never allow registration beyond event capacity.
- Never add or remove packages without approval.
- Never expose LocationIQ API keys or secret environment values.
- Never place secrets directly in source code.
- Never continuously track users after check-in.
- Never modify unrelated modules.
- Never change public function signatures without approval.
- Never introduce a new architecture pattern.
- Never perform destructive database or Git actions automatically.
- Never delete or weaken tests to make a build pass.
- Never hide failing tests.
- Never generate implementation before the scaffold and plan are reviewed.

## Definition of Done

A feature is complete only when:

- It follows the approved plan.
- It follows this CODEX.md.
- TypeScript has no unresolved type errors.
- Required unit tests pass.
- Required feature tests pass.
- Loading, empty, error, and success states are handled.
- Server-side validation exists where required.
- No unrelated files were modified.
- No unauthorized dependency was added.
- The diff has been reviewed.
- Known limitations are documented.
- A completion summary is provided.
