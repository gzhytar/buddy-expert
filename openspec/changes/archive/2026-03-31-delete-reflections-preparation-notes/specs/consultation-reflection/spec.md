## ADDED Requirements

### Requirement: Trvalé smazání vlastní reflexe

The system SHALL allow an authenticated expert to permanently delete a reflection session they solely own. Deletion SHALL require explicit confirmation in the UI (for example a dialog) that states the action is irreversible. After successful deletion, the reflection SHALL no longer appear in the expert’s lists and SHALL not be readable or editable under the same identifier.

#### Scenario: Successful delete from list

- **WHEN** the expert chooses to delete a specific reflection from their reflections list and confirms the dialog
- **THEN** the system removes that reflection and its dependent rows according to the data model and refreshes the list without that entry

#### Scenario: Another user cannot delete

- **WHEN** a user attempts to delete a reflection they do not own
- **THEN** the system denies the action and does not remove or expose the other user’s data

#### Scenario: Linked preparation remains

- **WHEN** the expert deletes a reflection that was linked to a preparation
- **THEN** the system removes only the reflection and SHALL NOT delete the preparation solely because of that link

### Requirement: Delete reflection from edit context

The system SHALL offer deletion from the reflection edit or detail context (for example header or actions menu) as well as from the history list, so the action is discoverable in one place the expert already uses.

#### Scenario: Delete while draft or complete is open

- **WHEN** the expert has their own reflection open and chooses delete with confirmation
- **THEN** the system performs the same permanent deletion as from the list and navigates to a safe view (for example the reflections list) without showing the deleted record
