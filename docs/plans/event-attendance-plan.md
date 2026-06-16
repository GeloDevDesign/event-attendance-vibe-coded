# Event Attendance Plan

## Project

EventQuest Attendance

## Purpose

EventQuest Attendance is a web-based event registration and GPS attendance system with pixel-art or modern 2D character markers.

The application is designed for a workshop demo with approximately 10 attendees per event.

## Objectives

- Allow administrators to create and manage events.
- Allow public users to register for multiple events.
- Allow users to select a character for every event registration.
- Allow attendance only when the user is inside the configured event radius.
- Display attendees as character markers on an OpenStreetMap map.
- Update the admin attendance map in real time.
- Keep the project simple, testable, secure, and suitable for a workshop demonstration.

## Platform

- Web application
- React with TypeScript
- Convex backend
- OpenStreetMap map tiles
- Leaflet.js map rendering
- LocationIQ geocoding and reverse geocoding

## User Roles

### Admin

The admin can:

- Log in.
- View all events.
- Create an event.
- View event details.
- View all registered attendees.
- View accepted and unaccepted registrations.
- View Present and Not Present attendees.
- Open the real-time attendance map.
- View attendee character markers.
- View attendee name, distance, GPS accuracy, check-in time, and attendance status.

### Public User

The public user can:

- Create an account.
- Log in.
- View available events.
- Register for multiple events.
- Enter first name and last name during registration.
- Select a character for each event registration.
- View joined events after login.
- Open the attendance page for a joined event.
- Grant browser location permission.
- View their location on the map.
- View the event radius.
- View a line from their location to the event location.
- View their current distance from the event.
- Attempt attendance check-in.
- Retry attendance when outside the radius while attendance is still open.

## Core Modules

1. Authentication
2. Admin Dashboard
3. Event Management
4. Character Management
5. Event Registration
6. Attendance Countdown
7. Browser Location Handling
8. Attendance Validation
9. User Attendance Map
10. Admin Real-Time Attendance Map
11. Attendance Statistics

## Event Creation

### Required Fields

- Event name
- Latitude
- Longitude
- Readable location
- Allowed radius in meters
- Maximum participants
- Event date
- Attendance start time
- Attendance end time
- Event status

### Location Selection

The admin selects the event location through the map.

The application uses:

- Leaflet.js to display the map.
- OpenStreetMap for map tiles.
- LocationIQ to search for a place and convert it into latitude and longitude.
- LocationIQ reverse geocoding to convert selected coordinates into a readable location.

The stored latitude and longitude are the source of truth for attendance validation.

### Event Statuses

- `draft`
- `open`
- `ongoing`
- `completed`
- `cancelled`

### Event Rules

- Only open events accept registrations.
- Registration closes automatically when maximum capacity is reached.
- Cancelled and completed events do not accept registrations.
- Attendance is available only during the configured attendance period.
- The event must have valid coordinates and a positive radius.
- Maximum participants must be greater than zero.
- Store `attendanceStartAt` and `attendanceEndAt` as UTC Unix timestamps in milliseconds.
- `eventDate` is for display and filtering only.

## Character Selection

### Character Style

- Pixel-art or modern 2D.
- Transparent PNG or WebP.
- Consistent image dimensions.
- Bottom-centered marker anchor so the character appears to stand on the map.

### Character Rules

- Character selection belongs to an event registration.
- The character is not permanently assigned to the user.
- A user may select different characters for different events.
- Multiple users may select the same character.
- Only active characters may be selected.

## Event Registration

### Registration Fields

- First name
- Last name
- Event
- User
- Selected character
- Acceptance status
- Registration timestamp

### Registration Flow

```text
User logs in
→ User views available events
→ User selects an event
→ User clicks Register
→ User enters first name and last name
→ User selects a character
→ System checks event status and remaining capacity
→ Registration is created
→ Registration is automatically accepted
→ Event appears in the user's joined events
```

### Registration Rules

- A user may register for multiple events.
- A user may register only once for the same event.
- Registration is automatically accepted.
- Store the result using `isAccepted = true`.
- Keep the acceptance field so manual approval can be introduced later.
- Registration fails when the event is full.
- Registration fails when the event is not open.
- Character selection is stored per registration.
- Registration capacity checks must be enforced on the backend.

## Joined Events

After login, the public user sees the events they joined.

Each joined event should show:

- Event name
- Readable location
- Event date
- Attendance start time
- Attendance end time
- Selected character
- Registration status
- Attendance status
- Attendance countdown or availability state
- Event lifecycle state such as open, attendance available, attendance closed, completed, or cancelled

Joined events must remain visible to the user even when the event later becomes completed or cancelled.

## Attendance Countdown

Before attendance begins:

- Show a countdown until the attendance start time.
- Disable the attendance button.
- Explain that attendance is not yet available.

When attendance opens:

- Enable the attendance button.
- Show how much attendance time remains.

When attendance closes:

- Disable the attendance button.
- Keep users without successful check-in as Not Present.

If a user already has a successful attendance record, show the stored Present result and disable another check-in attempt.

## Attendance Flow

```text
User opens a joined event
→ Countdown or attendance state is shown
→ User clicks Make Attendance
→ Browser asks for location permission
→ User allows location access
→ System receives latitude, longitude, and GPS accuracy
→ Attendance map opens
→ Event marker and radius are displayed
→ User character is plotted at the user's location
→ A line connects the event and user locations
→ Distance and GPS accuracy are displayed
→ Backend calculates the final distance
→ Backend validates registration, time, and radius
```

## Attendance Success

When the user is inside the allowed radius:

- Attendance is accepted.
- Status becomes Present.
- Check-in time is stored.
- Latitude and longitude are stored.
- GPS accuracy is stored.
- Server-calculated distance is stored.
- The character appears on the admin real-time map.
- The user cannot create another successful attendance record for the same registration.

## Attendance Failure

When the user is outside the allowed radius:

- Attendance is rejected.
- Status remains Not Present.
- Show: `You are not within the event location.`
- Show current distance.
- Show allowed event radius.
- Allow the user to retry while attendance remains open.

Other failure cases:

- Location permission denied.
- Browser location unavailable.
- GPS coordinates invalid.
- Attendance not yet open.
- Attendance already closed.
- User not registered.
- Registration not accepted.
- Attendance already completed.
- Event cancelled.
- Concurrent duplicate attendance submission.

## Attendance Statuses

User-facing statuses:

- Present
- Not Present

Stored representation:

- `isPresent = true`
- `isPresent = false`

For the initial workshop demo, store only successful attendance records.

- Present means a successful attendance record exists.
- Not Present means the accepted registration has no successful attendance record.

## Server-Side Validation

The backend must validate:

- Authenticated user
- Event existence
- Registration existence
- Registration ownership
- Registration acceptance
- Attendance time window
- Valid latitude and longitude
- GPS accuracy value
- Server-calculated distance
- Radius boundary
- Duplicate successful attendance
- Event status still allows attendance

The frontend must never decide the final attendance result.

## Distance Validation

- Calculate distance using event coordinates and submitted user coordinates.
- Ignore any client-provided distance.
- Treat a user exactly on the radius boundary as inside.
- Store the server-calculated result for audit purposes.
- Use meters consistently.
- Attendance is valid when `now >= attendanceStartAt` and `now <= attendanceEndAt`.
- Duplicate successful check-ins must be prevented even if two requests arrive at nearly the same time.
- GPS accuracy is captured and displayed but does not reject attendance unless a later requirement changes this rule.

## User Attendance Map

The user map displays:

- OpenStreetMap tiles
- Event marker
- Event radius circle
- User character marker
- Line between event and user
- Current distance
- GPS accuracy
- Attendance status

The map should initialize once and clean up when the page unmounts.

## Admin Real-Time Attendance Map

The admin map displays:

- Event location
- Event radius
- All registered attendees
- All attendee characters
- Present and Not Present status
- Attendee name
- Distance from event
- GPS accuracy
- Check-in time
- Present count
- Not Present count
- Total registered count

### Real-Time Behavior

- Successful attendance appears without refreshing.
- Attendance totals update automatically.
- Duplicate subscriptions must be avoided.
- Subscriptions must be cleaned up when the page unmounts.

### Overlapping Characters

Because the demo supports approximately 10 users:

- Display all characters directly.
- Do not use clustering.
- A small visual offset may be applied to overlapping markers.
- Do not change stored GPS coordinates.
- Show the distance line only for the selected attendee.

## Required Pages

### Public Pages

- Login
- Account Registration
- Available Events
- Joined Events
- Event Details
- Event Registration
- Attendance Map
- Attendance Result

### Admin Pages

- Admin Dashboard
- Event List
- Create Event
- Event Details
- Registered Attendees
- Character Management
- Real-Time Attendance Map

## Loading, Empty, Error, and Success States

Every page and feature must include:

- Loading state
- Empty state
- Error state
- Success state

Examples:

- No available events.
- No joined events.
- No registered attendees.
- Location permission denied.
- Map failed to load.
- LocationIQ request failed.
- Attendance accepted.
- Attendance rejected.

## Security and Privacy Rules

- Do not continuously track users.
- Request location only during an attendance attempt.
- Do not trust client-provided attendance status.
- Do not trust client-provided distance.
- Do not trust client-provided user identity or role.
- Do not expose LocationIQ API keys.
- Do not place secrets in source code.
- Do not allow one user to submit attendance for another registration.
- Do not create duplicate successful attendance records.
- Do not allow attendance outside the configured time.
- Do not allow registration beyond capacity.
- Enforce admin-only access on the server for admin pages, admin queries, and admin mutations.
- Public users may access only their own registrations and attendance data.
- Keep LocationIQ secret usage on the server or in protected environment configuration only.

## Testing Requirements

### Unit Tests

- Distance calculation
- Exact radius boundary
- Countdown calculation
- Event capacity calculation
- Coordinate validation
- GPS accuracy validation
- Attendance status conversion
- Map data transformation

### Feature Tests

- Admin creates an event.
- User registers for an event.
- Registration is automatically accepted.
- User selects a character per registration.
- User registers for multiple events.
- Duplicate registration is rejected.
- Registration fails when capacity is full.
- User sees joined events after login.
- Attendance cannot begin before the configured start time.
- Attendance fails after the configured end time.
- Location permission rejection is handled.
- Unregistered users cannot check in.
- Unaccepted registrations cannot check in.
- Attendance succeeds inside the radius.
- Attendance fails outside the radius.
- Attendance succeeds exactly at the radius boundary.
- Client-provided distance is ignored.
- Duplicate successful attendance is rejected.
- Concurrent duplicate successful attendance is rejected.
- Failed attendance may be retried while attendance remains open.
- Successful attendance appears on the admin map.
- Real-time totals update correctly.
- One user cannot modify another user's attendance.
- Cancelled events block attendance.

## Out of Scope

- QR code attendance
- Check-out attendance
- Continuous location tracking
- Character levels
- Experience points
- Character powers
- Character marketplace
- Certificates
- Event payments
- Waiting lists
- Native mobile application
- Large-scale clustering
- Multiple attendance sessions per event
- Manual attendance approval
- Attendance-attempt audit history for failed check-ins

## Definition of Done

The feature is complete when:

- Admin can create and view events.
- Users can register for multiple events.
- Registration closes automatically at maximum capacity.
- Character selection is stored per registration.
- Users can view joined events.
- Attendance countdown works.
- Browser location permission is requested.
- User and event locations appear on the map.
- Event radius and distance line are displayed.
- The backend validates attendance distance.
- Users inside the radius become Present.
- Users outside the radius remain Not Present.
- Admin receives real-time attendance updates.
- Unit tests pass.
- Feature tests pass.
- TypeScript has no unresolved errors.
- No unrelated files are modified.
