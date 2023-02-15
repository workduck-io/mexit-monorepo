# mexit

## 0.19.11

### Patch Changes

- 0c5e7b85: Share namespace fixes

## 0.19.10

### Patch Changes

- 6e19e9a0: React Contexify Dependency removed, Editor Preview Rendering Inline Components Fixes

## 0.19.9

### Patch Changes

- b2a11af1: Extension UI changes

## 0.19.8

### Patch Changes

- 0a2eedb6: Set stage correctly in extension config
- b8f6972a: Upgrade to vite v4
- e6047020: Deploy on stage test on push to main; Use middleware endpoints for loch,reaction,comments,prompt

## 0.19.7

### Patch Changes

- 5f170fdb: Delete namespace added

## 0.19.6

### Patch Changes

- 85d87e1c: Use Append Content API, ElementMetadata in blocks on Highlight
- 2e137eac: Note public access from metadata, Dibba Universal

## 0.19.5

### Patch Changes

- 68870f05: Update Memoized Snippets on change, Move selection after inserting element in combobox

## 0.19.4

### Patch Changes

- b958095b: Web Link Aliases In Combobox, New Snippet from Spotlight
- b1101f79: Style fixes for smaller screens

## 0.19.3

### Patch Changes

- de222f81: Prompts in Mexit

## 0.19.2

### Patch Changes

- f46b44b8: Shared spaces fixes

## 0.19.1

### Patch Changes

- f454e6bf: Fix themes and colors
- cd236ec6: Update Search Index On Highlight

## 0.19.0

### Minor Changes

- da8d83bc: <Extension-Webapp> message passing changed to store based updates

### Patch Changes

- 45808f81: Links and Meta sync in extension, Note error boundary
- 442f1252: New theming
- c8b667d8: Snippet init index in Extension

## 0.18.16

### Patch Changes

- e82221f8: Bulk setters for zustand
- 01d52a15: - Fixed height of editor preview in template modal
  - Icons in extension and create new icon in combobox fixed
  - Create new note template ID condition fixed
  - Now tags can be added to save links directly
  - Sortener sends properties when shortening links, results in better previews when shortened links are pasted
  - Backlinks in public namespaces are now visible, considering that the backlinked note is also part of the namespace
  - Fixed metadata extraction after icon changes

## 0.18.15

### Patch Changes

- 4b9346d9: Upgrade Dwindle to 0.1.0 with Ky Client
- e7107af9: Icon picker for Notes, useMetadata store
- b1512c35: Combobox UI changes

## 0.18.14

### Patch Changes

- 35fdcc34: Fixed publish action

## 0.18.13

### Patch Changes

- b312a108: - fixed image CDN upload from webapp
  - updated background of iframe rendered actions to that of extension for seamless look
  - displayed shortcut for commenting
  - updated message for when no shared notes fixed todo status in public nodes
  - fixed builds and added build test action
  - fixed referenceID for creating quick notes
  - made some changes towards consistent font and other sizes in extension sidebar

## 0.18.12

### Patch Changes

- 4373205e: Moved extension over to Vite; Remove some dead code
- cfa94de1: Updated changeset publish action post extension with vite #286
- dd088cbd: Highlights as a spearate entity
- 58d65222: Api layer added
- 9adc4068: Common ESLint config; Code Improvements
- 2b53eb1b: Smart capture config moved to DB

## 0.18.11

### Patch Changes

- 1d26f35b: Right Sidebar UX fixes
- 96a275d0: Dwindle bump version; Screenshot action works now

## 0.18.10

### Patch Changes

- 79ea3c8e: Bulk snippets, Media embed URL fixed

## 0.18.9

### Patch Changes

- 0e87147a: Editor Frequent Save Fixes; Image Upload Client Expiry Fixed

## 0.18.8

### Patch Changes

- cee329e9: User service routes updated to call the middleware
- ff1e216e: Fix task selection, reactions store, source url behavior
- 8508fb3d: Fixed content mixups during capture, added copy url button to sidebar, allowed underscores and dashes for shortener

## 0.18.7

### Patch Changes

- 2f3d2495: Sanitize apiURLs file; Move to staging

## 0.18.6

### Patch Changes

- 74a71866: Route Based Online Users
- 4b0c600f: add copy url button in avatar generator
- fa78e83c: Templated Notes; User Preferences Sync with Cloud

## 0.18.5

### Patch Changes

- 06c0cb67: Added new avatar generator action
- 2ce6d95d: Smart Capture Preference
- 77677961: Added download button for avatar generator action

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
