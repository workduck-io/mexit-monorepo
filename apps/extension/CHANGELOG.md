# mexit

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
