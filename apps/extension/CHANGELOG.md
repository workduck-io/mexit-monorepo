# mexit

## 0.18.4

### Patch Changes

- 77186a54: Public namespace fixes

## 0.18.3

### Patch Changes

- e2f5a887: Lesser re-highlighting, removed two way syncing of highlights and added hydration state to content store
- 5e58096d: Navigate tree, spaces and tabs in sidebar using shortcuts

## 0.18.2

### Patch Changes

- 32dcc7e4: Fix issues with search worker

## 0.18.1

### Patch Changes

- 1df9ae9f: Update middleware URL

## 0.18.0

### Minor Changes

- e038d8c9: Smart Capture in Command Bar

### Patch Changes

- 9529df1c: Added lorem ipsum action to copy placeholder text

## 0.17.3

### Patch Changes

- 1e77592c: This PR fixes new link shortening in extension sidebar, and some styling fixes
- 6f4ddd8a: Draggable extension sidebar toggle

## 0.17.2

### Patch Changes

- 64919a67: Fix extension, portal calls

## 0.17.1

### Patch Changes

- 50184d81: Fix Image upload and help modal

## 0.17.0

### Minor Changes

- 3f6266d5: Added wait for click to paste snippets in sidebar, new public nodes infobar.
- c4c5acbd: Keyboard navigation flow using shortcuts

## 0.16.0

### Minor Changes

- e2c0f573: Better mechanism for pasting snippets. Also screenshot action with cropping.

## 0.15.0

### Minor Changes

- f95af08f: New global sidebar in extension with context and snippets
- 5cfbe525: New Sputlit Command Bar

## 0.14.2

### Patch Changes

- 5da68ac1: Added basic form component and utils to capture metadata as form
- df470c2f: Updated useInitLoader hook to not redirect and show loader on all URLs

## 0.14.1

### Patch Changes

- 2e98d8fa: Add shared namespaces

## 0.14.0

### Minor Changes

- 016f51df: Reminders back in extension, they are now synced with backend. Also, added `/links` in `showNav()`.

## 0.13.0

### Minor Changes

- a2192598: Updated shortener action, added new links view to view shortened links and filter based on domain, highlights etc.

### Patch Changes

- 4ceae64f: Note, block refactoring with minor fixes

## 0.12.1

### Patch Changes

- b9d0b2ad: Removed redirect to base node for `/chotu`, clickable sidebar logo and better contrast on themes

## 0.12.0

### Minor Changes

- 789adc67: Better messaging between webapp and extension, things are synced on change and message can be sent from any component in extension now
- 2180238f: Added nested editable previews in webapp
- 3e3011a8: Added new task creation to webapp fleet, updated dwindle to v0.0.20

### Patch Changes

- 626ec88f: Create New Note Fixes; Combobox Create Child Fixes; Base Node Fixes
- 2e752f8d: Invalidate Webapp CloudFront Cache; Bump version automatically in manifest.json

## 0.11.3

### Patch Changes

- a7fe1622: Went back to old middleware deployment url, added env variables in publish action for extension

## 0.11.2

### Patch Changes

- 92ed10c3: Live Suggested; Task View and Filter Fixes

## 0.11.1

### Patch Changes

- 065698ec: Updated extension's API requests and other functions calls to support namespaces. Also updated the connection between webapp and extension to sync namespaces.
- dbe0cb4c: Added extension manifest.json version update in changeset action, this would fix the extension's publishing to chrome store.
- 82bf5a4a: Added documentation for setting up monorepo, also added a small fix to changeset publish action

## 0.11.0

### Minor Changes

- 85e5e33: Added namespaces support to webapp, and other changes to extension for the same.

### Patch Changes

- 1ce8f60: Breadcrumbs, metadata and source info disappear when user's typing. They re-appear on mouse move.
- 43836e0: Fixed changeset publish action
