# Implementation Plan

## Project


EventQuest Attendance

## Purpose

This document divides the approved EventQuest Attendance project into small, reviewable implementation phases.

The plan follows:

- `CODEX.md`
- `docs/plans/event-attendance-plan.md`
- `docs/plans/database-schema-plan.md`
- `docs/plans/feature-scaffold-plan.md`
- `.agents/agents.md`
- `convex/_generated/ai/guidelines.md`

Rules:

- Do not add a new architecture pattern.
- Keep each phase small and reviewable.
- Implement only the files required by the phase.
- Add tests as each phase is completed.
- Read Convex generated guidelines before any Convex changes.

---

## Phase 1. Authentication

### Objective

Set up the approved authentication foundation so users can sign in, register, sign out, and expose auth state to the app.

### Files Involved

- `convex/auth.config.ts`
- `convex/users.ts`
- `src/features/authentication/**`
- `src/types/user.types.ts`
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterAccountPage.tsx`

### Backend Work

- Finalize Convex auth configuration.
- Add current-user and role lookup queries.
- Define user creation or sync behavior tied to Convex identity.
- Use `tokenIdentifier` as the canonical auth-linked key.

### Frontend Work

- Implement login and register pages.
- Implement authentication hook and service.
- Expose authenticated user, loading state, and sign-out action.
- Prepare app wiring for Convex auth state.

### Validation Rules

- Authentication state must come from Convex auth, not client guesses.
- Authorization must not depend on email alone.
- User identity must be derived server-side from `ctx.auth.getUserIdentity()`.
- Admin and public roles must be handled explicitly.

### Unit Tests

- Auth-state mapping
- User-role mapping
- Authentication error-state handling

### Feature Tests

- User can register an account
- User can log in
- User can log out
- Current authenticated user is loaded correctly

### Optimization Checks

- Avoid duplicate auth lookups
- Keep auth state shared through existing hooks/services only

### Completion Criteria

- Auth config exists and is valid
- Current user and role can be resolved
- Login and register pages handle loading, error, and success states
- Tests for auth flow pass

### Dependencies on Earlier Phases

- None

---

## Phase 2. Convex Schema

### Objective

Implement the approved Convex schema, validators, and indexes for users, events, characters, registrations, and attendance records.

### Files Involved

- `convex/schema.ts`
- `convex/_generated/ai/guidelines.md`

### Backend Work

- Define all approved tables.
- Add validators for every stored field.
- Add approved indexes using Convex naming rules.
- Keep attendance records as successful check-ins only.

### Frontend Work

- No production UI work.
- Confirm shared frontend types remain aligned with schema fields.

### Validation Rules

- All IDs use Convex ID validators.
- Multi-field indexes use `by_field1_and_field2` naming.
- `attendanceStartAt` and `attendanceEndAt` use UTC timestamps in milliseconds.
- `tokenIdentifier` is the canonical auth lookup field.

### Unit Tests

- Schema field coverage checks
- Validator-shape checks where practical

### Feature Tests

- Schema can support approved event, registration, and attendance data shapes

### Optimization Checks

- Add only indexes that support real queries
- Avoid unnecessary duplicated data

### Completion Criteria

- All required tables exist
- All required indexes exist
- Field names match approved plans
- Schema aligns with Convex guidelines

### Dependencies on Earlier Phases

- Phase 1 for auth identity decisions

---

## Phase 3. Character Management

### Objective

Implement admin character management and public character selection support.

### Files Involved

- `convex/characters.ts`
- `src/features/characters/**`
- `src/pages/AdminCharactersPage.tsx`

### Backend Work

- Implement list, create, update, and active-state functions.
- Enforce active/inactive rules.
- Preserve historical registrations by deactivating rather than deleting.

### Frontend Work

- Implement admin character management UI.
- Implement character selector and grid.
- Handle loading, empty, error, and success states.

### Validation Rules

- Only active characters are selectable.
- Character images must use the approved stored field shape.
- Destructive deletion must not be part of the default flow.

### Unit Tests

- Character status mapping
- Character selector behavior

### Feature Tests

- Admin can view characters
- Admin can create a character
- Admin can deactivate a character
- Public user sees active characters only

### Optimization Checks

- Avoid duplicate active-character queries
- Reuse shared character types across admin and public views

### Completion Criteria

- Admin character management works
- Public selector works with active characters
- Tests pass

### Dependencies on Earlier Phases

- Phase 1
- Phase 2

---

## Phase 4. Event Management

### Objective

Implement event creation, event listing, event details, event status handling, and location selection support.

### Files Involved

- `convex/events.ts`
- `src/features/events/**`
- `src/pages/AvailableEventsPage.tsx`
- `src/pages/EventDetailsPage.tsx`
- `src/pages/AdminEventsPage.tsx`
- `src/pages/AdminCreateEventPage.tsx`
- `src/pages/AdminEventDetailsPage.tsx`
- `src/features/attendance-map/services/locationIqService.ts`

### Backend Work

- Implement event list and detail queries.
- Implement event creation and update mutations.
- Implement status change mutation.
- Enforce admin-only writes.

### Frontend Work

- Implement event list, event card, and event form.
- Implement admin create/edit pages.
- Implement location picker integration shape.

### Validation Rules

- Latitude is between `-90` and `90`
- Longitude is between `-180` and `180`
- Radius is greater than zero
- Maximum participants is greater than zero
- `attendanceEndAt` must be after `attendanceStartAt`
- Only open events may accept registrations

### Unit Tests

- Coordinate validation
- Attendance schedule validation
- Event status mapping

### Feature Tests

- Admin creates an event
- Invalid coordinates are rejected
- Invalid radius is rejected
- Invalid schedule is rejected
- Non-admin event creation is rejected

### Optimization Checks

- Avoid repeated event-detail queries on the same page
- Keep event list responses bounded

### Completion Criteria

- Admin can create and view events
- Public users can view open events
- Event details and statuses render correctly
- Tests pass

### Dependencies on Earlier Phases

- Phase 1
- Phase 2
- Phase 3 is not required

---

## Phase 5. Event Registration

### Objective

Implement event registration with automatic acceptance, duplicate prevention, capacity enforcement, and per-registration character selection.

### Files Involved

- `convex/registrations.ts`
- `src/features/registrations/**`
- `src/pages/EventRegistrationPage.tsx`

### Backend Work

- Implement register-for-event mutation.
- Check duplicate registration by `eventId + userId`.
- Check event status and remaining capacity in the same mutation.
- Enforce active-character selection.

### Frontend Work

- Implement event registration form.
- Load character choices and event context.
- Show registration errors and success states.

### Validation Rules

- A user may register only once for the same event
- Registration requires an open event
- Registration must fail when capacity is full
- `isAccepted` defaults to `true`
- Character must be active

### Unit Tests

- Capacity calculation
- Duplicate registration check helpers

### Feature Tests

- User registers successfully
- Registration is automatically accepted
- Duplicate registration is rejected
- Registration fails when event is full
- Registration fails when event is not open
- Inactive character selection is rejected

### Optimization Checks

- Avoid duplicate registration-count lookups
- Keep mutation reads focused on the minimum required documents

### Completion Criteria

- Registration flow works end-to-end
- Capacity and duplicate checks are server-enforced
- Tests pass

### Dependencies on Earlier Phases

- Phase 1
- Phase 2
- Phase 3
- Phase 4

---

## Phase 6. Joined Events

### Objective

Implement the joined-events view so authenticated users can see registrations, selected characters, and attendance state.

### Files Involved

- `convex/registrations.ts`
- `src/features/registrations/hooks/useJoinedEvents.ts`
- `src/pages/JoinedEventsPage.tsx`
- `src/features/registrations/components/RegistrationCard.tsx`
- `src/features/registrations/components/RegistrationList.tsx`

### Backend Work

- Implement joined-events query for the current user.
- Include event status, selected character, and attendance-related display fields.

### Frontend Work

- Implement joined-events page and list rendering.
- Show availability state, registration status, and attendance status.

### Validation Rules

- Users may only see their own joined events
- Completed and cancelled joined events remain visible

### Unit Tests

- Joined-event display-state mapping

### Feature Tests

- User sees joined events after login
- Joined events remain visible after event completion or cancellation

### Optimization Checks

- Avoid separate queries per joined event row
- Return only fields required by the page

### Completion Criteria

- Joined-events page loads and renders correctly
- Ownership rules are enforced
- Tests pass

### Dependencies on Earlier Phases

- Phase 1
- Phase 2
- Phase 4
- Phase 5

---

## Phase 7. Attendance Countdown

### Objective

Implement countdown and availability state for attendance before, during, and after the attendance window.

### Files Involved

- `src/features/attendance/components/AttendanceCountdown.tsx`
- `src/features/attendance/hooks/useAttendanceCountdown.ts`
- `src/hooks/useCountdown.ts`
- `src/pages/AttendancePage.tsx`

### Backend Work

- No new backend logic beyond existing event timing fields.

### Frontend Work

- Implement countdown and availability messaging.
- Disable or enable attendance actions based on approved timing rules.

### Validation Rules

- Attendance is valid when `now >= attendanceStartAt && now <= attendanceEndAt`
- Closed attendance must stay disabled
- Existing successful attendance should show Present state instead of a new check-in action

### Unit Tests

- Countdown calculation
- Availability-state conversion

### Feature Tests

- Attendance cannot begin before the start time
- Attendance fails after the end time
- Existing successful attendance shows stored result

### Optimization Checks

- Avoid unnecessary timer re-renders
- Reuse shared countdown logic

### Completion Criteria

- Countdown behavior matches approved rules
- Buttons and state labels update correctly
- Tests pass

### Dependencies on Earlier Phases

- Phase 4
- Phase 5
- Phase 6

---

## Phase 8. Browser Location Handling

### Objective

Implement browser location permission handling and location capture for attendance attempts.

### Files Involved

- `src/hooks/useCurrentLocation.ts`
- `src/services/locationService.ts`
- `src/features/attendance/components/LocationPermissionState.tsx`
- `src/pages/AttendancePage.tsx`

### Backend Work

- No new backend logic beyond consuming captured coordinates later.

### Frontend Work

- Request location only during an attendance attempt.
- Capture latitude, longitude, and accuracy.
- Handle permission denied, unavailable, and error states.

### Validation Rules

- Location must not be tracked continuously
- Permission request must occur only during the attendance attempt
- Latitude, longitude, and accuracy must be captured before submission

### Unit Tests

- Coordinate validation helpers
- Location error-state mapping

### Feature Tests

- Browser location permission request is handled
- Permission denied state is shown
- Browser location unavailable state is shown

### Optimization Checks

- Do not request location repeatedly after one attempt starts
- Avoid keeping long-lived location watchers

### Completion Criteria

- Browser location flow works for allowed and denied states
- Location values are captured correctly
- Tests pass

### Dependencies on Earlier Phases

- Phase 7

---

## Phase 9. Server-Side Distance Validation

### Objective

Implement secure attendance check-in with server-side distance calculation and final result enforcement.

### Files Involved

- `convex/attendance.ts`
- `src/features/attendance/services/attendanceService.ts`
- `src/features/attendance/services/distanceService.ts`
- `src/features/attendance/hooks/useAttendance.ts`
- `src/features/attendance/components/AttendanceButton.tsx`
- `src/features/attendance/components/AttendanceResult.tsx`

### Backend Work

- Implement attendance mutation.
- Authenticate the user.
- Load event and registration.
- Verify ownership, acceptance, event status, and attendance window.
- Calculate distance on the backend.
- Prevent duplicate successful attendance, including concurrent submissions.
- Store successful attendance only.

### Frontend Work

- Submit attendance attempt input.
- Show accepted or rejected attendance result.
- Show server-calculated distance and approved messaging.

### Validation Rules

- Never trust client-provided distance
- Never trust client-provided attendance status
- Never trust client-provided user identity
- Registration must belong to the current user
- Event must still allow attendance
- Boundary distance counts as inside

### Unit Tests

- Distance calculation
- Exact radius boundary result
- Attendance-result mapping

### Feature Tests

- Attendance succeeds inside the radius
- Attendance fails outside the radius
- Attendance succeeds exactly at the radius boundary
- Duplicate successful attendance is rejected
- Concurrent duplicate successful attendance is rejected
- Unregistered users cannot check in
- Unaccepted registrations cannot check in
- One user cannot check in another user's registration

### Optimization Checks

- Keep the attendance mutation transactional and focused
- Avoid unnecessary cross-calls between Convex functions

### Completion Criteria

- Attendance result is decided server-side
- Successful attendance records are stored correctly
- Failed attempts remain Not Present
- Tests pass

### Dependencies on Earlier Phases

- Phase 1
- Phase 2
- Phase 4
- Phase 5
- Phase 7
- Phase 8

---

## Phase 10. User Attendance Map

### Objective

Implement the user-facing attendance map showing the event, radius, current user location, and distance line.

### Files Involved

- `src/features/attendance-map/components/AttendanceMap.tsx`
- `src/features/attendance-map/components/EventMarker.tsx`
- `src/features/attendance-map/components/EventRadiusCircle.tsx`
- `src/features/attendance-map/components/DistanceLine.tsx`
- `src/features/attendance-map/hooks/useLeafletMap.ts`
- `src/features/attendance-map/services/mapService.ts`
- `src/pages/AttendancePage.tsx`

### Backend Work

- Provide user attendance map data if needed through `convex/mapData.ts`.

### Frontend Work

- Render map tiles, event marker, radius circle, user marker, and distance line.
- Show GPS accuracy and distance display.
- Handle map loading and failure states.

### Validation Rules

- Map initializes once per mounted view
- Event coordinates remain the source of truth
- User map must not mutate stored coordinates

### Unit Tests

- Map data transformation
- Marker config helpers

### Feature Tests

- User sees event marker and radius
- User sees their current marker and distance line
- Map load failure is handled

### Optimization Checks

- Prevent repeated map initialization
- Clean up map resources on unmount

### Completion Criteria

- User attendance map renders correctly
- Map cleanup works
- Tests pass

### Dependencies on Earlier Phases

- Phase 4
- Phase 8
- Phase 9

---

## Phase 11. Admin Real-Time Attendance Map

### Objective

Implement the admin attendance map with all registered attendees, Present and Not Present states, selected-attendee details, and real-time updates.

### Files Involved

- `convex/mapData.ts`
- `src/features/attendance-map/components/AdminAttendanceMap.tsx`
- `src/features/attendance-map/components/AttendeeCharacterMarker.tsx`
- `src/features/attendance-map/components/AttendeePopup.tsx`
- `src/features/attendance-map/components/AttendanceMapLegend.tsx`
- `src/features/attendance-map/hooks/useAttendeeMapData.ts`
- `src/features/attendance-map/hooks/useSelectedAttendee.ts`
- `src/pages/AdminAttendanceMapPage.tsx`

### Backend Work

- Implement admin map data query.
- Join registrations, characters, and successful attendance records.
- Return null coordinates for Not Present attendees.
- Support Convex reactive updates.

### Frontend Work

- Render all attendees on the map.
- Show selected-attendee line and popup details.
- Show Present and Not Present states.

### Validation Rules

- Only admins can access admin map data
- Not Present attendees must remain listed
- Only Present attendees include stored coordinates
- Visual overlap offsets must not change stored coordinates

### Unit Tests

- Admin map data transformation
- Selected-attendee state mapping

### Feature Tests

- Admin sees all registered attendees
- Present attendees include coordinates
- Not Present attendees show null location values
- Successful attendance appears without refresh

### Optimization Checks

- Avoid duplicate subscriptions
- Keep reactive query payload focused

### Completion Criteria

- Admin real-time attendance map works
- Real-time attendee updates appear correctly
- Tests pass

### Dependencies on Earlier Phases

- Phase 3
- Phase 4
- Phase 5
- Phase 9
- Phase 10

---

## Phase 12. Dashboard Statistics

### Objective

Implement attendance and registration summary statistics for the admin dashboard.

### Files Involved

- `convex/attendance.ts`
- `convex/mapData.ts`
- `src/pages/AdminDashboardPage.tsx`

### Backend Work

- Implement event attendance statistics query.
- Return Present count, Not Present count, and total registered count.

### Frontend Work

- Show dashboard summary cards or stats sections.
- Handle loading, empty, and error states.

### Validation Rules

- Counts must reflect successful attendance records plus accepted registrations
- Public users must not access dashboard statistics

### Unit Tests

- Statistics derivation logic

### Feature Tests

- Admin sees attendance totals
- Totals update after successful attendance

### Optimization Checks

- Avoid duplicate stats queries for the same dashboard view
- Keep results bounded and aggregated

### Completion Criteria

- Dashboard statistics render correctly
- Totals stay aligned with map and attendance data
- Tests pass

### Dependencies on Earlier Phases

- Phase 5
- Phase 9
- Phase 11

---

## Phase 13. Security Review

### Objective

Audit the implemented system for auth, authorization, attendance manipulation risks, secret handling, and location privacy.

### Files Involved

- Relevant `convex/*.ts` files
- Relevant `src/features/**` files
- Relevant page files
- Environment-related configuration files

### Backend Work

- Verify every protected query and mutation uses server-side identity checks.
- Verify admin-only operations enforce role checks.
- Verify attendance cannot be forged from client input.

### Frontend Work

- Verify the UI does not imply permissions the backend does not enforce.
- Verify secrets are not embedded in frontend source.

### Validation Rules

- Role must be checked server-side
- Ownership must be checked server-side
- Location tracking must not continue after the attendance attempt
- Client-provided distance, identity, and attendance state must never be trusted

### Unit Tests

- Security helper tests if introduced

### Feature Tests

- Public user cannot access admin data
- One user cannot view or modify another user's registration or attendance
- Cancelled events block attendance

### Optimization Checks

- Security fixes must not introduce unnecessary duplicate queries

### Completion Criteria

- Security review findings are resolved or documented
- Authorization and ownership rules are verified
- Relevant tests pass

### Dependencies on Earlier Phases

- Phases 1 through 12

---

## Phase 14. Final Testing

### Objective

Run the final verification pass across all implemented phases and confirm the project meets the approved definition of done.

### Files Involved

- All implemented files in `src/`
- All implemented files in `convex/`
- Test files in `src/features/**/__tests__`
- Test files in `convex/__tests__`

### Backend Work

- Run final Convex function verification.
- Verify schema, queries, mutations, and auth integration remain aligned.

### Frontend Work

- Run final page and feature verification.
- Confirm loading, empty, error, and success states exist where required.

### Validation Rules

- No unrelated files should be changed
- No unauthorized dependencies should be added
- Type names and file names must remain consistent with the approved conventions

### Unit Tests

- Run all approved unit tests

### Feature Tests

- Run all approved feature tests
- Include auth, registration, attendance, maps, admin data, and security flows

### Optimization Checks

- Check for duplicate queries
- Check for duplicate subscriptions
- Check for repeated map initialization
- Check for unnecessary complexity for the workshop demo

### Completion Criteria

- TypeScript has no unresolved errors
- Required unit tests pass
- Required feature tests pass
- Security review is complete
- Known limitations are documented
- Final implementation summary is ready

### Dependencies on Earlier Phases

- Phases 1 through 13
