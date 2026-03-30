# Orientace — základy

Kanónická delta z `refine-mvp-ux-slice`.

## Requirements

### Requirement: Mission and service frame summary

The system SHALL present a concise summary of the JIC mission and consultation service frame so experts understand what “alignment with the JIC frame” means in reflection.

#### Scenario: Expert opens orientation overview

- **WHEN** an authenticated expert navigates to the orientation entry point
- **THEN** the system displays mission and service-frame summary content suitable as context for consultation work

### Requirement: Konzultantské desatero as reference

The system SHALL display **Konzultantské desatero** — the ten JIC consulting principles — as reference material, each with a stable identifier and human-readable title or short label so they can be referenced consistently from reflection flows.

#### Scenario: Expert views Konzultantské desatero

- **WHEN** an authenticated expert opens the Konzultantské desatero section of orientation
- **THEN** the system lists exactly ten principles with identifiable labels matching the JIC brand framework described in the product specification

### Requirement: Sixteen situational roles by phase

The system SHALL display all sixteen situational consulting roles organized under the four phase groups: Contract and frame; Company diagnosis; Leading the session; Solution creation; each role SHALL have a stable identifier and display name.

#### Scenario: Expert browses roles catalog

- **WHEN** an authenticated expert opens the roles section of orientation
- **THEN** the system shows sixteen roles grouped under the four phases with correct membership per the JIC role model

### Requirement: Orientation is read-only in slice 1

The system SHALL NOT require mandatory completion of orientation, quizzes, or gating of other features (including reflection) based on orientation progress or role self-evaluation. The system MAY offer voluntary structured activities in orientation (such as per-role self-evaluation) and MAY surface non-blocking reminders to complete them; such reminders MUST NOT prevent access to reflection or other core workflows.

#### Scenario: Expert skips orientation and opens reflection

- **WHEN** an authenticated expert navigates directly to creating a reflection without visiting orientation
- **THEN** the system allows access and does not block on orientation completion state or role self-evaluation completion

#### Scenario: Incomplete role self-evaluation and reflection

- **WHEN** an authenticated expert has not completed role self-evaluation for all sixteen roles
- **THEN** the system still allows access to reflection and does not require completion of role self-evaluation as a precondition

### Requirement: Accessible, responsive orientation UI

The system SHALL provide orientation pages that are usable on common mobile and desktop viewports and meet baseline accessibility for navigation and reading (semantic structure, keyboard-accessible controls where interactive elements exist).

#### Scenario: Expert uses keyboard and small viewport

- **WHEN** an expert navigates orientation with keyboard only on a narrow viewport
- **THEN** content remains readable and navigation between orientation sections remains operable
