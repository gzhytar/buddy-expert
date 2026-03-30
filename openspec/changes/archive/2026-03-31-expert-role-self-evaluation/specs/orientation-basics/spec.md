## MODIFIED Requirements

### Requirement: Orientation is read-only in slice 1

The system SHALL NOT require mandatory completion of orientation, quizzes, or gating of other features (including reflection) based on orientation progress or role self-evaluation. The system MAY offer voluntary structured activities in orientation (such as per-role self-evaluation) and MAY surface non-blocking reminders to complete them; such reminders MUST NOT prevent access to reflection or other core workflows.

#### Scenario: Expert skips orientation and opens reflection

- **WHEN** an authenticated expert navigates directly to creating a reflection without visiting orientation
- **THEN** the system allows access and does not block on orientation completion state or role self-evaluation completion

#### Scenario: Incomplete role self-evaluation and reflection

- **WHEN** an authenticated expert has not completed role self-evaluation for all sixteen roles
- **THEN** the system still allows access to reflection and does not require completion of role self-evaluation as a precondition
