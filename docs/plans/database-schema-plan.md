# Database Schema Plan

## Project

EventQuest Attendance

## Backend

Convex

Before creating or modifying Convex code, always read:

```text
convex/_generated/ai/guidelines.md
```

The generated Convex guidelines override generic assumptions about Convex APIs and patterns.

## Goals

The schema must support:

- Authentication
- Admin and public user roles
- Event creation
- Character management
- Multiple event registrations per user
- One registration per user per event
- Automatic registration acceptance
- Event capacity limits
- One character per registration
- GPS attendance validation
- Present and Not Present status
- Real-time admin map updates
- Fast lookup by user, event, registration, and attendance status
- Auth-linked lookup by stable identity token

## General Conventions

- Collection names use plural camelCase nouns.
- Field names use camelCase.
- References use descriptive names ending in `Id`.
- Boolean fields use `is`, `has`, `can`, or `should`.
- Store timestamps as numeric Unix timestamps in milliseconds unless Convex guidelines require another format.
- Use Convex validators for every stored field.
- Do not manually edit generated Convex files.
- Do not duplicate data unless it has a clear read-performance or audit purpose.

## Collections

## 1. `users`

Stores application users and their role.

### Fields

```text
tokenIdentifier
name
email
role
createdAt
updatedAt
```

### Field Details

- `tokenIdentifier`: Stable authentication identity from Convex auth.
- `name`: Display name of the account.
- `email`: User email used for profile display and communication.
- `role`: `admin` or `public`.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### Rules

- `tokenIdentifier` must be unique and used as the canonical auth-linked lookup key.
- Email may be unique if the chosen auth flow guarantees it, but authorization must not depend on email alone.
- Only users with role `admin` may access administrative features.
- Public users may register for events and create attendance records only for themselves.

### Suggested Indexes

```text
by_email
by_tokenIdentifier
by_role
```

## 2. `events`

Stores event configuration and location.

### Fields

```text
name
locationName
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

### Field Details

- `name`: Event name.
- `locationName`: Readable location from LocationIQ or admin input.
- `latitude`: Event latitude.
- `longitude`: Event longitude.
- `radiusMeters`: Allowed attendance radius.
- `maximumParticipants`: Registration capacity.
- `eventDate`: Event date value for display and filtering.
  It is not the source of truth for attendance timing.
- `attendanceStartAt`: Timestamp when attendance opens.
- `attendanceEndAt`: Timestamp when attendance closes.
- `status`: `draft`, `open`, `ongoing`, `completed`, or `cancelled`.
- `createdBy`: Reference to the admin user.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### Rules

- Latitude must be between `-90` and `90`.
- Longitude must be between `-180` and `180`.
- Radius must be greater than zero.
- Maximum participants must be greater than zero.
- Attendance end time must be later than attendance start time.
- Only open events may accept registrations.
- Completed and cancelled events cannot accept registrations.

### Suggested Indexes

```text
by_status
by_createdBy
by_eventDate
by_attendanceStartAt
```

## 3. `characters`

Stores selectable character assets.

### Fields

```text
name
imageUrl
isActive
createdAt
updatedAt
```

### Field Details

- `name`: Character display name.
- `imageUrl`: URL or storage path for the character image.
- `isActive`: Whether users may select the character.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### Rules

- Only active characters may be selected.
- Character images should use transparent PNG or WebP.
- Character deletion should not break historical registrations.
- Prefer deactivation over destructive deletion when already referenced.

### Suggested Indexes

```text
by_isActive
by_name
```

## 4. `eventRegistrations`

Stores a user's registration for an event and their selected character.

### Fields

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

### Field Details

- `eventId`: Reference to `events`.
- `userId`: Reference to `users`.
- `characterId`: Reference to `characters`.
- `firstName`: Attendee first name for this registration.
- `lastName`: Attendee last name for this registration.
- `isAccepted`: Automatic acceptance status.
- `registeredAt`: Registration timestamp.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### Rules

- A user may register for multiple events.
- A user may register only once for the same event.
- New registrations use `isAccepted = true`.
- Registration must fail when the event is full.
- Registration must fail when the event is not open.
- The selected character must exist and be active.
- Capacity checks and registration creation must be handled safely to prevent overbooking.

### Uniqueness Rule

Convex does not use a traditional SQL unique constraint in the same way.

Enforce uniqueness in the registration mutation by checking the combination:

```text
eventId + userId
```

### Suggested Indexes

```text
by_eventId
by_userId
by_characterId
by_eventId_and_userId
by_eventId_and_isAccepted
```

The most important index is:

```text
by_eventId_and_userId
```

It supports duplicate-registration checks.

## 5. `attendanceRecords`

Stores successful attendance check-in data.

### Fields

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

### Field Details

- `eventId`: Reference to `events`.
- `registrationId`: Reference to `eventRegistrations`.
- `userId`: Reference to `users`.
- `latitude`: Submitted user latitude.
- `longitude`: Submitted user longitude.
- `accuracyMeters`: Browser-reported GPS accuracy.
- `distanceMeters`: Server-calculated distance from the event.
- `isInsideRadius`: Server-calculated radius result.
- `isPresent`: Final attendance result.
- `checkedInAt`: Successful attendance timestamp.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### Rules

- The authenticated user must own the registration.
- The registration must belong to the event.
- The registration must be accepted.
- The event must be inside its attendance window.
- Latitude and longitude must be valid.
- Distance must always be calculated on the backend.
- Ignore client-provided distance and attendance status.
- A user exactly on the radius boundary is inside.
- Only one successful attendance record is allowed per registration.
- Users outside the radius may retry while attendance remains open.
- Attendance is valid when `now >= attendanceStartAt` and `now <= attendanceEndAt`.
- Event status must still allow attendance when check-in is attempted.
- Duplicate successful attendance must be prevented for concurrent requests.

### Attendance Attempt Decision

Recommended initial design:

- Store only successful attendance records.
- Keep failed attendance attempts in application logs or add a separate collection later when audit history becomes necessary.

This keeps the workshop demo simple.

### Suggested Indexes

```text
by_eventId
by_registrationId
by_userId
by_eventId_and_isPresent
by_eventId_and_userId
```

The most important duplicate-attendance lookup is:

```text
by_registrationId
```

Before inserting a successful attendance record, verify that no successful record already exists for the registration.

## Optional Collection

## 6. `attendanceAttempts`

This collection is optional and should be added only when failed-attempt audit history is required.

### Fields

```text
eventId
registrationId
userId
latitude
longitude
accuracyMeters
distanceMeters
isInsideRadius
result
attemptedAt
```

### Possible Results

```text
inside_radius
outside_radius
too_early
too_late
invalid_location
registration_not_found
registration_not_accepted
duplicate_attendance
event_cancelled
```

### Recommendation

Do not include this collection in the first workshop implementation unless the audit history is required.

## Relationship Summary

```text
users
  ├── creates many events
  ├── has many eventRegistrations
  └── has many attendanceRecords

events
  ├── belongs to one admin creator
  ├── has many eventRegistrations
  └── has many attendanceRecords

characters
  └── has many eventRegistrations

eventRegistrations
  ├── belongs to one event
  ├── belongs to one user
  ├── belongs to one character
  └── has zero or one successful attendanceRecord

attendanceRecords
  ├── belongs to one event
  ├── belongs to one registration
  └── belongs to one user
```

## Required Queries

### Events

- List open events.
- List all events for admin.
- Get event details.
- Get event registration count.
- Check whether event capacity is full.
- Get events by status.
- Get events joined by the current user.

### Characters

- List active characters.
- List all characters for admin.
- Get character details.

### Registrations

- Get registration by event and user.
- List registrations for an event.
- List registrations for the current user.
- Count registrations for an event.
- List accepted registrations for an event.

### Attendance

- Get attendance by registration.
- List attendance records for an event.
- List Present attendees for an event.
- List Not Present registrations by comparing accepted registrations with successful attendance.
- Get attendance statistics for an event.
- Subscribe to event attendance updates.

## Required Mutations

### Events

- Create event.
- Update event.
- Change event status.
- Cancel event.

### Characters

- Create character.
- Update character.
- Activate character.
- Deactivate character.

### Registrations

- Register for event.
- Cancel registration if added later.

### Attendance

- Check in attendance.

The attendance mutation must:

1. Authenticate the user.
2. Load the event.
3. Load the user's registration.
4. Verify registration ownership.
5. Verify acceptance.
6. Verify attendance time.
7. Validate coordinates and GPS accuracy.
8. Check for existing successful attendance.
9. Calculate distance on the backend.
10. Compare distance with the event radius.
11. Reject when outside the radius.
12. Store successful attendance when inside the radius.
13. Return the final server-calculated result.

## Capacity Handling

Registration creation must check:

```text
current accepted registrations < maximumParticipants
```

The capacity check and insert should occur within the same Convex mutation.

Do not calculate capacity only on the frontend.

## Present and Not Present Logic

### Present

A registration is Present when a successful attendance record exists.

### Not Present

An accepted registration is Not Present when no successful attendance record exists.

Do not create empty attendance records for every registration unless the application later requires that model.

This avoids unnecessary records and keeps attendance status derived from actual check-in data.

## Real-Time Map Data

The admin attendance map query should return:

```text
registrationId
userId
attendeeName
characterName
characterImageUrl
isPresent
latitude
longitude
accuracyMeters
distanceMeters
checkedInAt
```

For Not Present attendees:

```text
latitude = null
longitude = null
accuracyMeters = null
distanceMeters = null
checkedInAt = null
```

Only attendees with a successful location check-in should have map coordinates.

## LocationIQ Data

Store only the event location information required by the application:

```text
locationName
latitude
longitude
```

Do not store the full LocationIQ response unless a future requirement needs it.

The LocationIQ response must not be trusted for attendance calculations. Attendance calculations use stored event coordinates and submitted user coordinates.

## Data Validation

Validate every Convex function argument.

Important validations:

- IDs are valid Convex IDs.
- Names are non-empty and length-limited.
- Latitude is between `-90` and `90`.
- Longitude is between `-180` and `180`.
- Radius is positive.
- Capacity is a positive integer.
- Attendance end time is after start time.
- Accuracy is non-negative.
- Event status is one of the supported values.
- User role is one of the supported values.

## Authorization

### Admin-Only Operations

- Create event
- Update event
- Change event status
- Create character
- Update character
- Activate or deactivate character
- View all event registrations
- View admin real-time attendance data

### Public User Operations

- View open events
- View active characters
- Register for an event
- View their joined events
- View their own registration
- Check in attendance for their own registration

## Deletion Rules

For the workshop demo:

- Prefer event cancellation over event deletion.
- Prefer character deactivation over character deletion.
- Do not delete events with registrations.
- Do not delete characters referenced by registrations.
- Do not delete successful attendance records automatically.
- All destructive operations require explicit approval.

## Index Summary

Recommended indexes:

```text
users
- by_tokenIdentifier
- by_email
- by_role

events
- by_status
- by_createdBy
- by_eventDate
- by_attendanceStartAt

characters
- by_isActive
- by_name

eventRegistrations
- by_eventId
- by_userId
- by_characterId
- by_eventId_and_userId
- by_eventId_and_isAccepted

attendanceRecords
- by_eventId
- by_registrationId
- by_userId
- by_eventId_and_isPresent
- by_eventId_and_userId
```

Only add indexes that are used by real queries.

## Schema Completion Checklist

- All collections have Convex validators.
- All references use Convex IDs.
- Required indexes are defined.
- Auth identity lookup is defined using `tokenIdentifier`.
- Registration uniqueness is enforced.
- Capacity is enforced in the backend.
- Attendance distance is calculated in the backend.
- Duplicate successful attendance is prevented.
- Present and Not Present logic is defined.
- Admin and public authorization rules are defined.
- LocationIQ response storage is minimized.
- Generated Convex guidelines have been reviewed.
- Unit and feature tests cover schema-related business rules.
