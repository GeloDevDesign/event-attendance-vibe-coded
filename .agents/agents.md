# Agents

## Project

EventQuest Attendance

## Purpose

This document defines the approved Codex agents for planning, scaffolding, implementation, testing, optimization, and security review.

Every agent must follow:

- `AGENTS.md` or `CODEX.md`
- `docs/plans/event-attendance-plan.md`
- `docs/plans/database-schema-plan.md`
- `docs/plans/feature-scaffold-plan.md`
- `convex/_generated/ai/guidelines.md` for Convex work

## Global Agent Guardrails

- Run agents on a dedicated Git branch.
- Use suggest mode for changes to existing files.
- Use auto-edit only for safe new scaffold files.
- Set a maximum turn limit for every agent.
- Review all diffs before accepting changes.
- Never run destructive actions automatically.
- Never install or remove packages without approval.
- Never modify unrelated modules.
- Never weaken or delete tests to make a build pass.
- Never trust client-provided distance or attendance status.
- Never trust client-provided user identity or role.
- Never expose LocationIQ secrets.
- Never continuously track user location.
- Stop when requirements conflict instead of guessing.

## Agent Definition Template

Every agent must define:

```text
Name
Goal
Scope
Inputs
Allowed Tools
Approval Mode
Maximum Turns
Trigger
Process
Expected Output
Verification
Stop Conditions
Never Do
```

# 1. Feature Scaffold Agent

## Name

`feature-scaffold-agent`

## Goal

Create the approved folder structure, files, public interfaces, types, and test placeholders without implementing production logic.

## Scope

- React feature folders
- Shared components
- Shared hooks
- Shared services
- Shared types
- Route pages
- Convex module files
- Test skeletons

## Inputs

- Feature plan
- Database schema plan
- Feature scaffold plan
- Existing project tree

## Allowed Tools

- Read files
- List directories
- Create new safe scaffold files
- Create empty test files
- Create type definitions
- Produce diffs

## Approval Mode

- Auto-edit for new safe scaffold files
- Suggest for existing file modifications

## Maximum Turns

12

## Trigger

At the start of a new feature or module.

## Process

```text
Read instructions
→ Inspect project tree
→ Compare project with scaffold plan
→ List missing files
→ Create approved safe scaffold files
→ Verify names and paths
→ Produce scaffold summary
```

## Expected Output

- Files created
- Files skipped because they already exist
- Public interfaces added
- Test placeholders added
- Conflicts found

## Verification

- No implementation logic exists.
- Folder structure matches the approved plan.
- No unrelated file changed.
- No dependency installed.
- Type names and file names follow conventions.

## Stop Conditions

- Required plan is missing.
- Existing architecture conflicts with the scaffold.
- A requested file would overwrite real implementation.
- A new dependency appears necessary.

## Never Do

- Never implement business logic.
- Never overwrite existing implementations.
- Never install packages.
- Never create unapproved folders.
- Never modify authentication automatically.

# 2. Event Management Agent

## Name

`event-management-agent`

## Goal

Implement event creation, listing, details, location selection, capacity, schedule, and status behavior.

## Scope

- Event pages
- Event components
- Event hooks and services
- Convex event functions
- Event tests
- LocationIQ search and reverse-geocoding integration

## Inputs

- Event feature scaffold
- Event rules
- Database schema
- Existing authentication and authorization helpers

## Allowed Tools

- Read and edit approved event files
- Run type checking
- Run relevant tests
- Produce diffs

## Approval Mode

Suggest

## Maximum Turns

16

## Trigger

After the event scaffold and schema are approved.

## Process

```text
Inspect event scaffold
→ Read Convex guidelines
→ Implement backend validation
→ Implement event forms and pages
→ Integrate location selection
→ Add tests
→ Run tests and type checks
→ Review diff
```

## Expected Output

- Event creation
- Event listing
- Event details
- Event status handling
- Capacity fields
- Location selection
- Validation errors
- Unit and feature tests

## Verification

- Only admins can create events.
- Coordinates are valid.
- Radius and capacity are positive.
- Attendance end time follows start time.
- LocationIQ failures are handled.
- LocationIQ key is not exposed improperly.
- Relevant tests pass.

## Stop Conditions

- Authentication strategy is not available.
- LocationIQ configuration is missing.
- Event schema conflicts with the approved plan.
- More than two focused fixes fail.

## Never Do

- Never trust frontend validation alone.
- Never store the full LocationIQ response without approval.
- Never expose secret keys.
- Never add an unapproved map provider.
- Never modify unrelated features.

# 3. Character Management Agent

## Name

`character-management-agent`

## Goal

Implement character creation, activation, listing, and selection.

## Scope

- Character admin page
- Character list and selector
- Character Convex functions
- Character tests

## Inputs

- Character scaffold
- Character rules
- Registration requirements

## Allowed Tools

- Read and edit character files
- Run relevant tests
- Produce diffs

## Approval Mode

Suggest

## Maximum Turns

12

## Trigger

After authentication and event scaffolding are ready.

## Process

```text
Inspect character files
→ Implement schema-safe operations
→ Implement admin management UI
→ Implement public selector
→ Add tests
→ Verify inactive-character behavior
```

## Expected Output

- Character management
- Active character list
- Character selector
- Character tests

## Verification

- Only active characters are selectable.
- Existing referenced characters are not destructively removed.
- Images render with consistent marker dimensions.
- Tests pass.

## Stop Conditions

- Storage strategy for character assets is undefined.
- Existing data would be deleted.
- New package installation is required.

## Never Do

- Never delete referenced characters automatically.
- Never allow inactive character selection.
- Never store secrets in character data.
- Never change registration ownership rules.

# 4. Registration Agent

## Name

`event-registration-agent`

## Goal

Implement event registration, automatic acceptance, capacity validation, duplicate prevention, and per-registration character selection.

## Scope

- Registration pages and forms
- Registration hooks and services
- Convex registration queries and mutations
- Joined-events view
- Registration tests

## Inputs

- Event data
- Character data
- Registration scaffold
- Database schema plan

## Allowed Tools

- Read and edit approved registration files
- Run tests
- Run type checks
- Produce diffs

## Approval Mode

Suggest

## Maximum Turns

16

## Trigger

After event and character modules work.

## Process

```text
Inspect registration scaffold
→ Read Convex guidelines
→ Implement duplicate check
→ Implement capacity check
→ Implement automatic acceptance
→ Implement character selection
→ Implement joined-events query
→ Add tests
→ Run verification
```

## Expected Output

- Successful registration
- Automatic `isAccepted = true`
- Duplicate protection
- Capacity enforcement
- Joined-events page
- Tests

## Verification

- A user may join multiple different events.
- A user cannot join the same event twice.
- Full events reject new registrations.
- Closed events reject new registrations.
- Only active characters may be selected.
- Registration ownership is correct.
- Tests pass.

## Stop Conditions

- Event capacity cannot be read safely.
- Stable authentication identity is unavailable.
- More than two focused fixes fail.
- Schema differs from the approved plan.

## Never Do

- Never enforce capacity only in the UI.
- Never accept a client-provided user ID as ownership proof.
- Never create duplicate registrations.
- Never modify attendance logic.
- Never install packages.

# 5. Attendance Validation Agent

## Name

`attendance-validation-agent`

## Goal

Implement secure server-side attendance validation and successful check-in recording.

## Scope

- Attendance mutation
- Distance calculation utility
- Attendance button and result
- Attendance countdown
- Attendance tests

## Inputs

- Event location and schedule
- User registration
- Browser coordinates and GPS accuracy
- Attendance schema
- Security rules

## Allowed Tools

- Read and edit approved attendance files
- Run unit tests
- Run feature tests
- Run type checks
- Produce diffs

## Approval Mode

Suggest

## Maximum Turns

18

## Trigger

After event registration is complete.

## Process

```text
Read all attendance rules
→ Read Convex guidelines
→ Inspect event and registration functions
→ Implement server-side ownership checks
→ Implement schedule validation
→ Implement coordinate validation
→ Calculate distance on the backend
→ Enforce radius boundary
→ Prevent duplicate successful attendance
→ Add unit and feature tests
→ Run verification
```

## Expected Output

- Secure attendance mutation
- Present or Not Present result
- Server-calculated distance
- Retry behavior for failed attendance
- Duplicate prevention
- Tests

## Verification

- User is authenticated.
- Registration belongs to the user.
- Registration is accepted.
- Attendance time is valid.
- Coordinates are valid.
- Client-provided distance is ignored.
- Exact boundary counts as inside.
- Outside-radius users are rejected.
- Duplicate successful attendance is rejected.
- Concurrent duplicate successful attendance is rejected.
- Tests pass.

## Stop Conditions

- Registration ownership cannot be verified.
- Event time format is unclear.
- Distance rule conflicts with the plan.
- More than two focused fixes fail.

## Never Do

- Never trust client distance.
- Never trust client attendance status.
- Never trust client user identity or role.
- Never mark Present before backend validation.
- Never allow one user to check in another registration.
- Never continuously track location.
- Never create duplicate successful records.

# 6. Map Integration Agent

## Name

`leaflet-map-agent`

## Goal

Implement OpenStreetMap and Leaflet.js map behavior for event location, radius, character markers, popups, and distance lines.

## Scope

- User attendance map
- Admin attendance map
- Leaflet hooks
- Map services
- LocationIQ service
- Map tests

## Inputs

- Event coordinates
- Attendee map data
- Character images
- LocationIQ configuration
- Map scaffold

## Allowed Tools

- Read and edit approved map files
- Run component tests
- Run type checks
- Produce diffs

## Approval Mode

Suggest

## Maximum Turns

16

## Trigger

After event and attendance data are available.

## Process

```text
Inspect map scaffold
→ Verify Leaflet and tile configuration
→ Implement event marker
→ Implement radius circle
→ Implement character marker
→ Implement selected-attendee line
→ Implement popups and legend
→ Handle overlapping characters
→ Add cleanup logic
→ Add tests
```

## Expected Output

- OpenStreetMap display
- Leaflet event marker
- Radius circle
- Standing character markers
- Selected-attendee distance line
- Attendee popup
- Error and loading states
- Tests

## Verification

- Map initializes once.
- Map cleans up on unmount.
- Character marker uses bottom anchoring.
- Stored coordinates are not changed for visual offsets.
- All attendee markers can be clicked.
- Distance line appears only for selected attendee.
- LocationIQ errors are handled.
- Tests pass.

## Stop Conditions

- Required package is missing and installation is not approved.
- Tile or LocationIQ configuration is unavailable.
- Existing map implementation conflicts with the plan.

## Never Do

- Never switch to another map provider.
- Never expose LocationIQ secrets.
- Never continuously request user location.
- Never mutate stored GPS coordinates for marker spacing.
- Never create repeated map instances.

# 7. Real-Time Attendance Agent

## Name

`real-time-attendance-agent`

## Goal

Implement live admin attendance updates using Convex subscriptions.

## Scope

- Admin attendance map data
- Attendance totals
- Live attendee updates
- Subscription cleanup
- Real-time tests

## Inputs

- Attendance records
- Event registrations
- Character data
- Admin map scaffold

## Allowed Tools

- Read and edit approved real-time files
- Run tests
- Run type checks
- Produce diffs

## Approval Mode

Suggest

## Maximum Turns

14

## Trigger

After successful attendance and admin map features exist.

## Process

```text
Inspect map-data query
→ Read Convex guidelines
→ Implement reactive query
→ Join registration and character data
→ Derive Present and Not Present totals
→ Connect admin map
→ Prevent duplicate subscriptions
→ Add tests
```

## Expected Output

- Live attendance map updates
- Live Present count
- Live Not Present count
- Live total registration count
- Subscription cleanup
- Tests

## Verification

- Successful check-in appears without refresh.
- Not Present attendees remain listed.
- Only Present attendees include coordinates.
- Totals remain accurate.
- Duplicate subscriptions do not occur.
- Tests pass.
- Joined users for cancelled or completed events remain visible but cannot create new attendance.

## Stop Conditions

- Registration and attendance data cannot be joined safely.
- Existing query causes circular or duplicated subscriptions.
- More than two focused fixes fail.

## Never Do

- Never poll when a Convex subscription already solves the problem.
- Never create duplicate subscriptions.
- Never omit Not Present attendees from totals.
- Never expose another user's private data outside admin scope.

# 8. Test Generator Agent

## Name

`test-generator-agent`

## Goal

Generate unit and feature tests for approved behavior without changing production behavior.

## Scope

- React unit tests
- Feature tests
- Convex function tests
- Map behavior tests
- Attendance validation tests

## Inputs

- Approved implementation
- Feature plan
- Database schema plan
- Existing test conventions

## Allowed Tools

- Read production files
- Create or edit test files
- Run tests
- Produce coverage and failure summaries

## Approval Mode

Suggest

## Maximum Turns

15

## Trigger

After each module implementation.

## Process

```text
Inspect public behavior
→ List required cases
→ Create tests
→ Run tests
→ Fix test mistakes only
→ Report uncovered risks
```

## Expected Output

- Happy-path tests
- Failure tests
- Boundary tests
- Authorization tests
- Test execution report

## Verification

- Tests match actual public behavior.
- Tests do not duplicate implementation details unnecessarily.
- Tests include radius boundary.
- Tests include duplicate registration and attendance.
- Tests include concurrent duplicate attendance protection.
- Tests include capacity and time-window behavior.
- Tests pass.

## Stop Conditions

- Implementation behavior is unclear.
- Required test utilities are unavailable.
- Production code appears incorrect.
- More than two focused test fixes fail.

## Never Do

- Never change production logic just to satisfy a mistaken test.
- Never delete failing tests.
- Never skip critical tests.
- Never mock the business rule being tested.

# 9. Optimization Review Agent

## Name

`optimization-review-agent`

## Goal

Review implemented features for unnecessary rendering, duplicate queries, duplicate subscriptions, repeated map initialization, and avoidable complexity.

## Scope

- React rendering
- Hooks
- Convex queries and subscriptions
- Leaflet initialization and cleanup
- Shared types and utilities

## Inputs

- Completed feature
- Performance-sensitive files
- Existing tests

## Allowed Tools

- Read files
- Produce a report
- Suggest focused changes
- Apply approved changes
- Run tests

## Approval Mode

- Read-only first
- Suggest for approved fixes

## Maximum Turns

12

## Trigger

After feature tests pass.

## Process

```text
Inspect
→ Report findings
→ Human review
→ Apply approved focused optimizations
→ Run tests
→ Report before and after
```

## Expected Output

- Findings by severity
- File references
- Focused optimization suggestions
- Approved changes
- Verification report

## Verification

- No behavior changed.
- No premature abstraction was introduced.
- No unnecessary memoization was added.
- Map and subscriptions clean up properly.
- Tests pass.

## Stop Conditions

- No measurable or clear issue exists.
- Suggested optimization increases complexity without benefit.
- Tests fail after two focused fixes.

## Never Do

- Never refactor unrelated code.
- Never add caching without need.
- Never add memoization everywhere.
- Never replace simple code with complex abstraction.
- Never change public behavior.

# 10. Security Audit Agent

## Name

`security-audit-agent`

## Goal

Review authentication, authorization, attendance manipulation, location privacy, secrets, and destructive operations.

## Scope

- Authentication checks
- Admin authorization
- Registration ownership
- Attendance ownership
- Server-side distance validation
- LocationIQ secret handling
- Environment configuration
- Destructive mutations

## Inputs

- Relevant source files
- Feature plan
- Database schema plan
- Security rules
- Existing tests

## Allowed Tools

- Read files
- Create audit report
- Suggest approved fixes
- Run security-related tests
- Produce diffs

## Approval Mode

- Read-only for audit
- Suggest for approved fixes

## Maximum Turns

14

## Trigger

Before feature completion or merge.

## Process

```text
Inspect
→ Report vulnerabilities by severity
→ Human review
→ Fix approved issues only
→ Run relevant tests
→ Produce final report
```

## Expected Output

Use this format:

```text
[SEVERITY] [TYPE] [FILE/FUNCTION]: Description
Risk:
Recommended fix:
```

## Verification

- Attendance cannot be forged from client values.
- Users cannot access another registration.
- Public users cannot access admin data.
- LocationIQ secrets are not exposed.
- Location is not continuously tracked.
- Destructive operations require approval.
- Relevant tests pass.
- Server-side role and ownership checks use stable auth identity rather than client-provided ids.

## Stop Conditions

- Required files cannot be read.
- Authentication design is incomplete.
- A proposed fix changes architecture.
- More than two focused fixes fail.

## Never Do

- Never fix unapproved findings.
- Never perform broad refactoring during an audit.
- Never expose secrets in reports.
- Never execute destructive commands.
- Never weaken authorization for convenience.

# Agent Execution Rules

## Git Branches

Recommended branch names:

```text
feature/event-management
feature/character-management
feature/event-registration
feature/attendance-validation
feature/attendance-map
agent/test-generation
agent/security-audit
agent/optimization-review
```

## Required Execution Sequence

```text
1. Read project instructions.
2. Read the relevant plans.
3. Read Convex generated guidelines when applicable.
4. Inspect existing files.
5. State intended scope.
6. Produce analysis or scaffold.
7. Wait for approval when required.
8. Modify only approved files.
9. Add or update tests.
10. Run relevant tests and type checks.
11. Review the diff.
12. Produce a final report.
```

## Required Final Report

Every modifying agent must report:

```text
Files inspected
Files created
Files modified
Behavior implemented
Tests added
Tests executed
Test results
Optimization performed
Known limitations
Remaining concerns
```

## Failure Handling

When a test fails:

1. Inspect the exact failure.
2. Determine whether the new change caused it.
3. Attempt a maximum of two focused fixes.
4. Run the relevant test after each fix.
5. Stop after two unsuccessful attempts.
6. Report the error and affected files.
7. Do not hide, skip, weaken, or delete the failing test.

## Actions Requiring Explicit Approval

- Database reset
- Migration rollback
- File deletion
- Git push
- Package installation or removal
- Environment variable changes
- Authentication configuration changes
- Public interface changes
- Database field removal
- Major folder restructuring
- Changes outside the requested feature
