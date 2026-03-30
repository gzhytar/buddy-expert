## ADDED Requirements

### Requirement: Per-role self-evaluation states

The system SHALL allow each authenticated expert to assign exactly one self-evaluation state per situational consulting role from a set of four: **love** (enjoys the role), **focus_improve** (wants to improve in the role), **dislike** (dislikes the role), and **neutral_defer** (does not wish to express a preference for that role at this time). Each of the sixteen canonical roles SHALL be assignable independently.

#### Scenario: Expert sets evaluation on a role

- **WHEN** an authenticated expert selects a self-evaluation option for a given role
- **THEN** the system persists that state for that user and role and replaces any previous state for the same role

#### Scenario: Expert changes mind

- **WHEN** an authenticated expert selects a different option for the same role
- **THEN** the system updates the stored state to the newly selected option

### Requirement: Completion of role self-evaluation

The system SHALL treat role self-evaluation as **complete** when all sixteen situational roles have a stored self-evaluation state for that user. Until then, self-evaluation SHALL be **incomplete**.

#### Scenario: Partial progress

- **WHEN** fewer than sixteen roles have a stored state for the user
- **THEN** the system considers self-evaluation incomplete

#### Scenario: Full coverage

- **WHEN** all sixteen roles have a stored state for the user
- **THEN** the system considers self-evaluation complete

### Requirement: Non-blocking prompts when incomplete

The system SHALL surface a clear, dismissible or ignorable invitation to complete role self-evaluation in relevant orientation surfaces (including at minimum the orientation overview and the orientation roles catalog) while self-evaluation is incomplete. The invitation MUST NOT block access to reflection or other non-orientation workflows.

#### Scenario: Incomplete evaluation on orientation overview

- **WHEN** an authenticated expert with incomplete role self-evaluation opens the orientation entry/overview
- **THEN** the system displays a prompt that explains they can mark their relationship to each role and links or navigates them toward the roles area where evaluation is possible

#### Scenario: Incomplete evaluation does not gate reflection

- **WHEN** an authenticated expert with incomplete role self-evaluation opens reflection or another core workflow outside orientation
- **THEN** the system does not deny access solely because role self-evaluation is incomplete

### Requirement: Focus reminder when complete

The system SHALL show a concise reminder listing the display names of all roles the expert marked as **focus_improve** on the orientation roles page when self-evaluation is complete. If none are marked as **focus_improve**, the system SHALL show a short neutral message indicating that no focus roles are selected (without requiring the user to add any).

#### Scenario: Expert has focus roles

- **WHEN** self-evaluation is complete and the user has at least one role with state **focus_improve**
- **THEN** the orientation roles page shows a compact summary that includes those role names as a reminder

#### Scenario: Expert has no focus roles

- **WHEN** self-evaluation is complete and no role has state **focus_improve**
- **THEN** the orientation roles page shows a brief message that no roles are marked for improvement focus

### Requirement: Accessible self-evaluation controls

The system SHALL provide keyboard-operable controls for choosing self-evaluation options, with descriptive labels or accessible names in the product language (Czech) so screen reader users understand each option.

#### Scenario: Keyboard user selects an option

- **WHEN** an expert moves focus to a role’s self-evaluation control group and activates an option
- **THEN** the choice is applied and assistive technologies receive an appropriate name for each option (love, focus on improvement, dislike, no preference)

### Requirement: Data scoped to authenticated user

The system SHALL store and return self-evaluation data only for the authenticated user; one user MUST NOT read or modify another user’s self-evaluation.

#### Scenario: Cross-user isolation

- **WHEN** user A is authenticated
- **THEN** requests to read or write self-evaluation apply only to user A’s records
