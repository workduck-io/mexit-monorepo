# mexit-webapp

## 0.19.6

### Patch Changes

- 17e1dc22: Fix bug with task note preview editor

## 0.19.5

### Patch Changes

- 5d48ee25: Fixes to plateless renderer

## 0.19.4

### Patch Changes

- 0d4e1548: Navigation fixes onclick snippets and tags

## 0.19.3

### Patch Changes

- b5180571: Move reminders to task view

## 0.19.2

### Patch Changes

- 4572280b: Task view with faux render
- 3f6266d5: Added wait for click to paste snippets in sidebar, new public nodes infobar.

## 0.19.1

### Patch Changes

- e2c0f573: Better mechanism for pasting snippets. Also screenshot action with cropping.

## 0.19.0

### Minor Changes

- f95af08f: New global sidebar in extension with context and snippets
- 5cfbe525: New Sputlit Command Bar

### Patch Changes

- c367ab21: [FIX] Requests getting fullfilled in runBatch even on throwing error.

## 0.18.1

### Patch Changes

- df470c2f: Updated useInitLoader hook to not redirect and show loader on all URLs

## 0.18.0

### Minor Changes

- 2e98d8fa: Add shared namespaces

### Patch Changes

- 73731cb3: Use middleware endpoints for URL and Reminders

## 0.17.1

### Patch Changes

- b021995b: Update useInitLoader() to not redirect on /integrations route

## 0.17.0

### Minor Changes

- 016f51df: Reminders back in extension, they are now synced with backend. Also, added `/links` in `showNav()`.

## 0.16.0

### Minor Changes

- 5951eb53: Public namespaces view for desktop and mobile devices

## 0.15.0

### Minor Changes

- a2192598: Updated shortener action, added new links view to view shortened links and filter based on domain, highlights etc.

### Patch Changes

- 4ceae64f: Note, block refactoring with minor fixes

## 0.14.1

### Patch Changes

- b9d0b2ad: Removed redirect to base node for `/chotu`, clickable sidebar logo and better contrast on themes

## 0.14.0

### Minor Changes

- 789adc67: Better messaging between webapp and extension, things are synced on change and message can be sent from any component in extension now
- 92e06d95: Add useInitLoader Hook to initialize Nodes and Snippets
- 2180238f: Added nested editable previews in webapp
- 3e3011a8: Added new task creation to webapp fleet, updated dwindle to v0.0.20

### Patch Changes

- 626ec88f: Create New Note Fixes; Combobox Create Child Fixes; Base Node Fixes
- 2e752f8d: Invalidate Webapp CloudFront Cache; Bump version automatically in manifest.json

## 0.13.0

### Minor Changes

- a9b9039a: Added ability to update tasks from tasks view through previews

## 0.12.1

### Patch Changes

- a7fe1622: Went back to old middleware deployment url, added env variables in publish action for extension

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
