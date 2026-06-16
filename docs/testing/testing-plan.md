# Testing Plan

## Project

EventQuest Attendance

## Purpose

This document defines the planned unit, feature, authorization, validation, map, and real-time test coverage for EventQuest Attendance.

It follows:

- `CODEX.md`
- `docs/plans/event-attendance-plan.md`
- `docs/plans/database-schema-plan.md`
- `docs/plans/feature-scaffold-plan.md`
- `docs/plans/implementation-plan.md`
- `convex/_generated/ai/guidelines.md`

Rules:

- Do not implement tests from this document directly.
- Keep all test cases aligned with the approved plans.
- Treat successful attendance records as stored records and Not Present as derived state.
- Treat exact radius boundary as inside the allowed event radius.

---

# Unit Test Cases

## 1. Distance Calculation

### Test Case 1.1

- Scenario: Calculate distance between two different coordinates
- Preconditions: Two valid latitude and longitude pairs are available
- Action: Call the distance calculation utility with both coordinates
- Expected result: The returned distance is in meters and greater than zero

### Test Case 1.2

- Scenario: Calculate distance between identical coordinates
- Preconditions: The same valid coordinate pair is used for both arguments
- Action: Call the distance calculation utility
- Expected result: The returned distance is zero

## 2. Exact Radius Boundary Tests

### Test Case 2.1

- Scenario: Attendance distance is exactly equal to the event radius
- Preconditions: Event radius and submitted coordinates produce a server-calculated distance equal to the radius
- Action: Run the attendance boundary validation
- Expected result: The attendee is treated as inside the radius

### Test Case 2.2

- Scenario: Attendance distance is slightly greater than the event radius
- Preconditions: Event radius and submitted coordinates produce a server-calculated distance slightly above the radius
- Action: Run the attendance boundary validation
- Expected result: The attendee is treated as outside the radius

## 3. Event Capacity Tests

### Test Case 3.1

- Scenario: Event still has available slots
- Preconditions: Accepted registration count is below `maximumParticipants`
- Action: Run capacity calculation
- Expected result: Capacity check returns available

### Test Case 3.2

- Scenario: Event is exactly full
- Preconditions: Accepted registration count equals `maximumParticipants`
- Action: Run capacity calculation
- Expected result: Capacity check returns full

## 4. Attendance Schedule Tests

### Test Case 4.1

- Scenario: Current time is before `attendanceStartAt`
- Preconditions: Valid event schedule exists and current time is earlier than the start time
- Action: Run attendance schedule validation
- Expected result: Attendance is not allowed

### Test Case 4.2

- Scenario: Current time is exactly equal to `attendanceStartAt`
- Preconditions: Valid event schedule exists and current time equals the start time
- Action: Run attendance schedule validation
- Expected result: Attendance is allowed

### Test Case 4.3

- Scenario: Current time is between `attendanceStartAt` and `attendanceEndAt`
- Preconditions: Valid event schedule exists and current time falls within the window
- Action: Run attendance schedule validation
- Expected result: Attendance is allowed

### Test Case 4.4

- Scenario: Current time is exactly equal to `attendanceEndAt`
- Preconditions: Valid event schedule exists and current time equals the end time
- Action: Run attendance schedule validation
- Expected result: Attendance is allowed

### Test Case 4.5

- Scenario: Current time is after `attendanceEndAt`
- Preconditions: Valid event schedule exists and current time is later than the end time
- Action: Run attendance schedule validation
- Expected result: Attendance is not allowed

## 5. Validation Test Cases

### Test Case 5.1

- Scenario: Latitude is below the allowed minimum
- Preconditions: Input latitude is less than `-90`
- Action: Run coordinate validation
- Expected result: Validation fails

### Test Case 5.2

- Scenario: Longitude is above the allowed maximum
- Preconditions: Input longitude is greater than `180`
- Action: Run coordinate validation
- Expected result: Validation fails

### Test Case 5.3

- Scenario: Radius is zero
- Preconditions: Event radius is `0`
- Action: Run event validation
- Expected result: Validation fails

### Test Case 5.4

- Scenario: Maximum participants is not positive
- Preconditions: `maximumParticipants` is `0` or negative
- Action: Run event validation
- Expected result: Validation fails

### Test Case 5.5

- Scenario: Attendance end time is earlier than attendance start time
- Preconditions: Event schedule has `attendanceEndAt < attendanceStartAt`
- Action: Run event validation
- Expected result: Validation fails

### Test Case 5.6

- Scenario: GPS accuracy is negative
- Preconditions: `accuracyMeters` is less than `0`
- Action: Run attendance input validation
- Expected result: Validation fails

## 6. Attendance Status Mapping

### Test Case 6.1

- Scenario: Successful attendance record exists
- Preconditions: Registration has one successful attendance record
- Action: Run attendance status mapping
- Expected result: Status is Present

### Test Case 6.2

- Scenario: Successful attendance record does not exist
- Preconditions: Accepted registration has no successful attendance record
- Action: Run attendance status mapping
- Expected result: Status is Not Present

## 7. Map Data Transformation

### Test Case 7.1

- Scenario: Present attendee map record is transformed for admin display
- Preconditions: Attendance record contains stored coordinates and check-in data
- Action: Run map data transformation
- Expected result: Output includes coordinates, distance, accuracy, and check-in time

### Test Case 7.2

- Scenario: Not Present attendee map record is transformed for admin display
- Preconditions: Accepted registration has no successful attendance record
- Action: Run map data transformation
- Expected result: Output includes null coordinate-related fields

---

# Feature Test Cases

## 8. Authentication

### Test Case 8.1

- Scenario: Public user registers an account
- Preconditions: Registration page is accessible and no authenticated session exists
- Action: Submit valid account registration details
- Expected result: Account registration succeeds and auth state is established or ready for login

### Test Case 8.2

- Scenario: Existing user logs in
- Preconditions: Valid user account exists
- Action: Submit valid login credentials
- Expected result: User becomes authenticated and is routed to the correct authenticated area

### Test Case 8.3

- Scenario: Authenticated user logs out
- Preconditions: User is authenticated
- Action: Trigger logout
- Expected result: Session ends and authenticated-only views are no longer accessible

## 9. Event Management

### Test Case 9.1

- Scenario: Admin creates a valid event
- Preconditions: Admin user is authenticated and on the create-event page
- Action: Submit valid event details
- Expected result: Event is created and appears in admin event listings

### Test Case 9.2

- Scenario: Admin submits invalid coordinates
- Preconditions: Admin user is authenticated
- Action: Submit an event with invalid latitude or longitude
- Expected result: Event creation fails with validation feedback

### Test Case 9.3

- Scenario: Admin submits invalid attendance schedule
- Preconditions: Admin user is authenticated
- Action: Submit an event with `attendanceEndAt` earlier than `attendanceStartAt`
- Expected result: Event creation fails with validation feedback

## 10. Event Capacity Tests

### Test Case 10.1

- Scenario: User registers while slots are still available
- Preconditions: Event status is open and accepted registrations are below capacity
- Action: Submit registration
- Expected result: Registration succeeds

### Test Case 10.2

- Scenario: User registers after capacity is reached
- Preconditions: Event status is open and accepted registrations equal capacity
- Action: Submit registration
- Expected result: Registration fails because the event is full

## 11. Duplicate Registration Tests

### Test Case 11.1

- Scenario: User registers for the same event twice
- Preconditions: User already has a registration for the event
- Action: Submit another registration for the same event
- Expected result: Registration is rejected as a duplicate

### Test Case 11.2

- Scenario: Same user registers for two different events
- Preconditions: User already has a registration for one event and another open event exists
- Action: Submit a registration for the other event
- Expected result: Registration succeeds

## 12. Joined Events

### Test Case 12.1

- Scenario: Authenticated user views joined events
- Preconditions: User has one or more event registrations
- Action: Open the joined-events page
- Expected result: Joined events are listed with event, registration, and attendance state details

### Test Case 12.2

- Scenario: Event later becomes cancelled
- Preconditions: User has already joined the event
- Action: Open the joined-events page after the event is cancelled
- Expected result: The event still appears in joined events with the updated lifecycle state

## 13. Attendance Countdown

### Test Case 13.1

- Scenario: User opens attendance before the start time
- Preconditions: User has a valid accepted registration and current time is before `attendanceStartAt`
- Action: Open the attendance page
- Expected result: Countdown is shown and attendance action is disabled

### Test Case 13.2

- Scenario: User opens attendance during the valid window
- Preconditions: User has a valid accepted registration and current time is within the window
- Action: Open the attendance page
- Expected result: Attendance action is enabled

### Test Case 13.3

- Scenario: User already has successful attendance
- Preconditions: Successful attendance record already exists for the registration
- Action: Open the attendance page
- Expected result: Present result is shown and new attendance action is disabled

## 14. Duplicate Attendance Tests

### Test Case 14.1

- Scenario: User attempts attendance again after a successful check-in
- Preconditions: Successful attendance record already exists
- Action: Submit another attendance attempt
- Expected result: Attendance is rejected as a duplicate successful attendance

### Test Case 14.2

- Scenario: Two nearly simultaneous attendance requests are submitted
- Preconditions: No successful attendance record exists yet and two requests are sent for the same registration
- Action: Submit both attendance requests
- Expected result: Only one request succeeds and the other is rejected

## 15. Attendance Schedule Tests

### Test Case 15.1

- Scenario: User attempts attendance before the attendance window
- Preconditions: Accepted registration exists and current time is before the start time
- Action: Submit attendance
- Expected result: Attendance is rejected

### Test Case 15.2

- Scenario: User attempts attendance after the attendance window
- Preconditions: Accepted registration exists and current time is after the end time
- Action: Submit attendance
- Expected result: Attendance is rejected

## 16. Location Permission Error Tests

### Test Case 16.1

- Scenario: Browser location permission is denied
- Preconditions: Attendance page is open and browser permission prompt is triggered
- Action: Deny location permission
- Expected result: Location error state is shown and attendance submission cannot continue

### Test Case 16.2

- Scenario: Browser location is unavailable
- Preconditions: Browser geolocation cannot resolve a location
- Action: Trigger location request
- Expected result: Location unavailable error state is shown

## 17. Server-Side Distance Validation

### Test Case 17.1

- Scenario: Attendance succeeds inside the allowed radius
- Preconditions: User is authenticated, registered, accepted, in time window, and coordinates are inside the radius
- Action: Submit attendance
- Expected result: Successful attendance record is stored and result is Present

### Test Case 17.2

- Scenario: Attendance fails outside the allowed radius
- Preconditions: User is authenticated, registered, accepted, in time window, and coordinates are outside the radius
- Action: Submit attendance
- Expected result: Attendance is rejected and status remains Not Present

### Test Case 17.3

- Scenario: Client provides a fake distance
- Preconditions: Attendance payload includes an incorrect client-side distance value
- Action: Submit attendance
- Expected result: Server ignores the client-provided distance and uses server-calculated distance

---

# Authorization Test Cases

## 18. Admin Authorization

### Test Case 18.1

- Scenario: Public user tries to create an event
- Preconditions: Authenticated public user exists
- Action: Call the create-event operation
- Expected result: Access is denied

### Test Case 18.2

- Scenario: Public user tries to access admin attendance map data
- Preconditions: Authenticated public user exists
- Action: Call the admin attendance map query or open the admin attendance page
- Expected result: Access is denied

### Test Case 18.3

- Scenario: Admin user accesses admin dashboard statistics
- Preconditions: Authenticated admin user exists
- Action: Open the admin dashboard or call the statistics query
- Expected result: Access is allowed

## 19. Ownership Authorization

### Test Case 19.1

- Scenario: User attempts to view another user’s registration
- Preconditions: Two users exist and one registration belongs to the other user
- Action: Request the other user’s registration data
- Expected result: Access is denied

### Test Case 19.2

- Scenario: User attempts attendance against another user’s registration
- Preconditions: Two users exist and one registration belongs to the other user
- Action: Submit attendance using the other user’s registration id
- Expected result: Attendance is rejected

### Test Case 19.3

- Scenario: Client sends a different user id in the request
- Preconditions: Authenticated user exists and payload includes a forged identity field
- Action: Submit protected operation with forged identity input
- Expected result: Server ignores the client identity and uses authenticated server identity

---

# Validation Test Cases

## 20. Registration Validation

### Test Case 20.1

- Scenario: Registration is attempted for a non-open event
- Preconditions: Event status is draft, ongoing, completed, or cancelled
- Action: Submit registration
- Expected result: Registration fails

### Test Case 20.2

- Scenario: Registration uses an inactive character
- Preconditions: Character exists but `isActive = false`
- Action: Submit registration with the inactive character
- Expected result: Registration fails

## 21. Attendance Validation

### Test Case 21.1

- Scenario: Attendance is attempted without authentication
- Preconditions: No authenticated session exists
- Action: Submit attendance
- Expected result: Attendance fails

### Test Case 21.2

- Scenario: Attendance is attempted without a registration
- Preconditions: Authenticated user exists but is not registered for the event
- Action: Submit attendance
- Expected result: Attendance fails

### Test Case 21.3

- Scenario: Attendance is attempted with an unaccepted registration
- Preconditions: Registration exists but `isAccepted = false`
- Action: Submit attendance
- Expected result: Attendance fails

### Test Case 21.4

- Scenario: Attendance is attempted for a cancelled event
- Preconditions: Registration exists and event status is cancelled
- Action: Submit attendance
- Expected result: Attendance fails

---

# Leaflet Map Behavior Tests

## 22. User Map

### Test Case 22.1

- Scenario: User attendance map initializes once
- Preconditions: Attendance page is opened with valid event and user location data
- Action: Mount the map view
- Expected result: One Leaflet map instance is created

### Test Case 22.2

- Scenario: User attendance map cleans up on unmount
- Preconditions: Leaflet map is mounted
- Action: Unmount the page or component
- Expected result: Map instance and listeners are cleaned up

### Test Case 22.3

- Scenario: User sees event marker, radius circle, and distance line
- Preconditions: Valid event and user location data are available
- Action: Render the user attendance map
- Expected result: Event marker, radius, user marker, and distance line are displayed

## 23. Admin Map

### Test Case 23.1

- Scenario: Admin sees Present attendees with coordinates
- Preconditions: Event has successful attendance records
- Action: Open the admin attendance map
- Expected result: Present attendees appear with marker locations

### Test Case 23.2

- Scenario: Admin sees Not Present attendees without coordinates
- Preconditions: Event has accepted registrations without successful attendance
- Action: Open the admin attendance map
- Expected result: Not Present attendees are listed with null coordinate fields

### Test Case 23.3

- Scenario: Overlapping attendee markers need visual offset
- Preconditions: Multiple Present attendees share nearby coordinates
- Action: Render the admin attendance map
- Expected result: Markers remain clickable and stored coordinates are unchanged

### Test Case 23.4

- Scenario: Selected attendee shows distance line only for that attendee
- Preconditions: Admin map is loaded with multiple attendees
- Action: Select one attendee marker
- Expected result: Distance line appears only for the selected attendee

---

# LocationIQ Failure Tests

## 24. Location Search and Reverse Geocoding

### Test Case 24.1

- Scenario: LocationIQ place search request fails
- Preconditions: Event location picker is open and LocationIQ request returns an error
- Action: Search for a place
- Expected result: Error state is shown and no invalid location is saved

### Test Case 24.2

- Scenario: LocationIQ reverse geocoding request fails
- Preconditions: Admin selects map coordinates and reverse geocoding fails
- Action: Attempt to resolve the readable location name
- Expected result: Error state is shown and the admin can correct or retry the selection flow

### Test Case 24.3

- Scenario: LocationIQ response is incomplete
- Preconditions: Search or reverse geocoding returns missing or partial readable-location data
- Action: Process the response
- Expected result: The application handles the failure safely and does not trust incomplete data as the source of truth

---

# Convex Real-Time Update Tests

## 25. Admin Real-Time Attendance Map Updates

### Test Case 25.1

- Scenario: Successful attendance appears without refreshing the admin map
- Preconditions: Admin map is open and a registered user successfully checks in
- Action: Complete a successful attendance submission
- Expected result: Admin map updates automatically with the new Present attendee

### Test Case 25.2

- Scenario: Attendance totals update automatically
- Preconditions: Admin dashboard or admin attendance map is open
- Action: Complete a successful attendance submission
- Expected result: Present, Not Present, and total counts refresh correctly

### Test Case 25.3

- Scenario: Duplicate subscriptions are avoided
- Preconditions: Admin map component mounts and re-renders during normal use
- Action: Exercise the admin attendance view through normal page interactions
- Expected result: Only the intended Convex subscriptions are active and duplicate real-time listeners are not created

### Test Case 25.4

- Scenario: Real-time subscriptions clean up on unmount
- Preconditions: Admin real-time attendance view is active
- Action: Leave the page or unmount the component
- Expected result: Subscriptions are cleaned up correctly
