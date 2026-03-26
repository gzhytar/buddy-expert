## ADDED Requirements

### Requirement: Start a new reflection

The system SHALL allow an authenticated expert to start a new post-consultation reflection session.

#### Scenario: Create draft reflection

- **WHEN** the expert chooses to create a new reflection
- **THEN** the system creates a reflection session owned by that expert and presents the reflection capture flow

### Requirement: Consultation context (non-CRM)

The system SHALL let the expert attach optional consultation context consisting of a free-text label or title and an optional consultation date-time, without requiring integration to YTracker or client identifiers.

#### Scenario: Expert names a consultation informally

- **WHEN** the expert enters a label such as an internal nickname or topic and saves the session
- **THEN** the system stores that label with the reflection and does not require a CRM identifier

### Requirement: Select relevant principles

The system SHALL let the expert select one or more of the ten JIC principles as relevant to the completed consultation.

#### Scenario: Principles multi-select

- **WHEN** the expert selects a subset of principles and continues
- **THEN** the system persists those selections on the reflection session

### Requirement: Select roles used and calibrate intensity

The system SHALL let the expert select one or more situational roles they used in the consultation and, for each selected role, record a calibration of `underused`, `balanced`, or `overused`.

#### Scenario: Role calibration per selected role

- **WHEN** the expert selects two roles and sets calibration for each
- **THEN** the system persists both roles with their respective calibration values

### Requirement: JIC frame alignment

The system SHALL capture whether the expert assesses the consultation as aligned with the JIC mission and service frame, via a short structured response and/or brief free text, without imposing a numeric performance score visible to managers.

#### Scenario: Expert records alignment

- **WHEN** the expert completes the frame-alignment step
- **THEN** the system stores the alignment response as part of the reflection session

### Requirement: Learning note

The system SHALL let the expert record a short learning note capturing takeaway for future consultations.

#### Scenario: Save learning note

- **WHEN** the expert enters a learning note within configured length limits and saves
- **THEN** the system persists the note on the reflection session

### Requirement: Complete and persist reflection

The system SHALL let the expert submit or save the reflection session as complete, persisting all captured fields atomically for that session.

#### Scenario: Successful completion

- **WHEN** the expert completes required fields per application validation rules and submits
- **THEN** the system stores the reflection and confirms success to the expert

### Requirement: List own reflections

The system SHALL let the expert view a list of their own reflection sessions with enough summary (e.g. label, date, last updated) to reopen or review.

#### Scenario: Expert sees history

- **WHEN** the expert opens their reflections list
- **THEN** the system shows only that expert’s sessions ordered by recency

### Requirement: Privacy of reflections

The system SHALL restrict read and write access to a reflection session to the owning authenticated expert only in MVP slice 1.

#### Scenario: Another user cannot access reflection

- **WHEN** a different authenticated user attempts to open a reflection session they do not own
- **THEN** the system denies access

### Requirement: Links to orientation from reflection

The system SHALL provide navigation from the reflection flow to orientation content (principles and roles) so experts can refresh the shared language without losing in-progress work where technically feasible.

#### Scenario: Open roles reference mid-reflection

- **WHEN** the expert opens roles reference from the reflection UI
- **THEN** the system opens orientation roles content in a way that avoids unintended data loss of the draft reflection
