# mexit-webapp

## 0.12.0

### Minor Changes

- fc9451fc: Update RHSidebar with no tabs, tags at top, title as "Note Content", forward backlinks, related notes in suggestions. Also fixed width of web embeds.
- 926be3da: Task view changes, styling fixes, minor bug fixes and improvements
- a8046772: Added Fleet in MexIt

### Patch Changes

- 92ed10c3: Live Suggested; Task View and Filter Fixes
- 3afbe511: This adds the redirect to desktop app for the whatsapp integration service.
- bcf2b5bd: Fixed issues with OAuth redirect (for whatsapp flows), fixed reminders creation error and added new filters on reminders view. Refactor works properly now.

## 0.11.1

### Patch Changes

- 065698ec: Updated extension's API requests and other functions calls to support namespaces. Also updated the connection between webapp and extension to sync namespaces.
- 82bf5a4a: Added documentation for setting up monorepo, also added a small fix to changeset publish action

## 0.11.0

### Minor Changes

- 85e5e33: Added namespaces support to webapp, and other changes to extension for the same.
- b546a00: Add new namespaces sidebar, with filter and new create new button. Also fixed task view context menu and base node setting.

### Patch Changes

- 1ce8f60: Breadcrumbs, metadata and source info disappear when user's typing. They re-appear on mouse move.
- 43836e0: Fixed changeset publish action
- a1b7e64: Adding previews in shared notes, in the case when the node in the backlink is also shared with the same user.
