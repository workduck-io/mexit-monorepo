# mexit-webapp

## 0.23.2

### Patch Changes

- 477c1746: Inherit Extra Fields From Parent View

## 0.23.1

### Patch Changes

- 50390dd0: Search in View hierarchy, move view store to core
- bd3a5bc8: Sidebar UI changes, layout changes
- c89e5cd9: AI-powered actions in extension, Editable query selection
- 3635ac2e: AI-Powered Selection Actions
- 915be017: Editor renderer instead of markdown for presentation
- 4c6e2474: 'Init Entities in API calls, inline tasks'
- 295c9ba7: View hierarchy

## 0.23.0

### Minor Changes

- 860dca96: Generic Views

### Patch Changes

- 44b78251: Request Handler fixes; Revert flexsearh to 0.7.22; UI and Search Fixes
- e194b4dd: Sync Views From Extension, CMD + S To Save Views
- d9d5b31f: Manual Refresh on Splash Screen
- 1d8ec7ca: Flexsearch to v0.0.6

## 0.22.25

### Patch Changes

- 9ce693a6: Presentation from Notes!

## 0.22.24

### Patch Changes

- 5e614919: Version Store Logout, API reset

## 0.22.23

### Patch Changes

- 023a94d1: Clear Request Cache, On Blur Clear Buffer

## 0.22.22

### Patch Changes

- dfb9c433: Create Snippets, Note based on Space context, Public Note UI changes
- 9fa5a163: Unified more stores to improve code brevity; Fixed termination of workers; Add force logout for this version

## 0.22.21

### Patch Changes

- 6843aaa9: Unify content store; Revert terminate worker function;

## 0.22.20

### Patch Changes

- 1d0d4f80: Use Deepmerge, floating-ui transitions for Previews

## 0.22.19

### Patch Changes

- 3631b016: URL based routing in Snippets, navigate from extension to webapp fixes; Fallback search in notes sidebar
- 3bf23f3a: View buffer save; Omnibox fixes; Search infobar fixes

## 0.22.18

### Patch Changes

- cb08b047: Manage Spaces and Share UX Improvements
- accf416d: Added refresh token logic to extension

## 0.22.17

### Patch Changes

- 0c5e7b85: Share namespace fixes

## 0.22.16

### Patch Changes

- 6e19e9a0: React Contexify Dependency removed, Editor Preview Rendering Inline Components Fixes

## 0.22.15

### Patch Changes

- b2a11af1: Extension UI changes

## 0.22.14

### Patch Changes

- 3de714f4: Custom Context Menu
- b8f6972a: Upgrade to vite v4
- e6047020: Deploy on stage test on push to main; Use middleware endpoints for loch,reaction,comments,prompt

## 0.22.13

### Patch Changes

- 0d4c7587: Create Task using Slash command, DraftView and Tags Layout changes'

## 0.22.12

### Patch Changes

- f4235dbf: Card View Changes, Default Kanban Renderer

## 0.22.11

### Patch Changes

- 0a65a868: List Type In View Added

## 0.22.10

### Patch Changes

- de30e4b6: Add Socials, setWorkspaceHeader on Init

## 0.22.9

### Patch Changes

- ff3efc20: App Init Intermediate state, User Details Fixes
- a4eab3b1: Public note title and icon fixes

## 0.22.8

### Patch Changes

- 4e55e7f8: Keydown event propgation fixed
- 197194f3: Updated user register and status flow

## 0.22.7

### Patch Changes

- 44d7a601: Update Highlight Endpoints; Update Sharing Access Level Checks
- 3a332b91: Minor UI fixes
- 5f170fdb: Delete namespace added

## 0.22.6

### Patch Changes

- 85d87e1c: Use Append Content API, ElementMetadata in blocks on Highlight
- 2e137eac: Note public access from metadata, Dibba Universal

## 0.22.5

### Patch Changes

- 68870f05: Update Memoized Snippets on change, Move selection after inserting element in combobox

## 0.22.4

### Patch Changes

- b958095b: Web Link Aliases In Combobox, New Snippet from Spotlight
- b1101f79: Style fixes for smaller screens

## 0.22.3

### Patch Changes

- 41213c73: Updated Cognito Trigger Register Flow

## 0.22.2

### Patch Changes

- 9e51a40a: Prompt Info with Results in Combobox Preview

## 0.22.1

### Patch Changes

- a406ec65: Recently Generated Prompt Results in Combobx
- b8d18e24: Fix editor title and code block highlights
- d3f7fa7f: Fix editor empty ux issues

## 0.22.0

### Minor Changes

- de222f81: Prompts in Mexit

### Patch Changes

- e14cbe04: UI fixes
- d446964b: Mobile Public View Fixes
- af31efa6: Add editable views, fix styles

## 0.21.2

### Patch Changes

- f46b44b8: Shared spaces fixes

## 0.21.1

### Patch Changes

- f454e6bf: Fix themes and colors
- cd236ec6: Update Search Index On Highlight

## 0.21.0

### Minor Changes

- da8d83bc: <Extension-Webapp> message passing changed to store based updates

### Patch Changes

- 45808f81: Links and Meta sync in extension, Note error boundary
- c8dd2732: Add view block
- 442f1252: New theming
- c8b667d8: Snippet init index in Extension

## 0.20.11

### Patch Changes

- e82221f8: Bulk setters for zustand
- 01d52a15: - Fixed height of editor preview in template modal
  - Icons in extension and create new icon in combobox fixed
  - Create new note template ID condition fixed
  - Now tags can be added to save links directly
  - Sortener sends properties when shortening links, results in better previews when shortened links are pasted
  - Backlinks in public namespaces are now visible, considering that the backlinked note is also part of the namespace
  - Fixed metadata extraction after icon changes

## 0.20.10

### Patch Changes

- 4b9346d9: Upgrade Dwindle to 0.1.0 with Ky Client
- 284e1b2a: Update Archive Page and Endpoints
- e7107af9: Icon picker for Notes, useMetadata store
- b1512c35: Combobox UI changes

## 0.20.9

### Patch Changes

- 35fdcc34: Fixed publish action

## 0.20.8

### Patch Changes

- b312a108: - fixed image CDN upload from webapp
  - updated background of iframe rendered actions to that of extension for seamless look
  - displayed shortcut for commenting
  - updated message for when no shared notes fixed todo status in public nodes
  - fixed builds and added build test action
  - fixed referenceID for creating quick notes
  - made some changes towards consistent font and other sizes in extension sidebar

## 0.20.7

### Patch Changes

- fe568bbe: Bundle IFrame Separately; Remove Dead Code; Run ESLint
- 4373205e: Moved extension over to Vite; Remove some dead code
- 26535684: Share User response fixes
- cfa94de1: Updated changeset publish action post extension with vite #286
- dd088cbd: Highlights as a spearate entity
- 58d65222: Api layer added
- 9adc4068: Common ESLint config; Code Improvements
- 2b53eb1b: Smart capture config moved to DB

## 0.20.6

### Patch Changes

- a7044a37: Fix bulk get methods; Pass namespaceID in case of shared namespace notes
- 1d26f35b: Right Sidebar UX fixes
- 96a275d0: Dwindle bump version; Screenshot action works now
- caafbb54: Fix tag menu, no empty comments

## 0.20.5

### Patch Changes

- 79ea3c8e: Bulk snippets, Media embed URL fixed

## 0.20.4

### Patch Changes

- 0f794c1b: User Logout fixes
- 0e87147a: Editor Frequent Save Fixes; Image Upload Client Expiry Fixed
- 89748744: Fix analysis worker crashes, theme init, user fetch

## 0.20.3

### Patch Changes

- cee329e9: User service routes updated to call the middleware
- 555961f7: Added bulk snippet get endpoint
- ff1e216e: Fix task selection, reactions store, source url behavior

## 0.20.2

### Patch Changes

- 6da5c84f: Fixes 12nov task, comments

## 0.20.1

### Patch Changes

- e990f8da: Batch get nodes while initialization
- 519bd036: Auth check in update preferences & active current user
- 2f3d2495: Sanitize apiURLs file; Move to staging

## 0.20.0

### Minor Changes

- 60c8ea3f: Add Comments and Reactions

### Patch Changes

- 74a71866: Route Based Online Users
- 5d3b13fa: Fix bugs related to combobox, links, reminder view
- fa78e83c: Templated Notes; User Preferences Sync with Cloud

## 0.19.14

### Patch Changes

- 2ce6d95d: Smart Capture Preference

## 0.19.13

### Patch Changes

- 77186a54: Public namespace fixes

## 0.19.12

### Patch Changes

- e2f5a887: Lesser re-highlighting, removed two way syncing of highlights and added hydration state to content store
- 5e58096d: Navigate tree, spaces and tabs in sidebar using shortcuts

## 0.19.11

### Patch Changes

- 32dcc7e4: Fix issues with search worker

## 0.19.10

### Patch Changes

- 391e24db: Null checks for extractLinkFromData and deserialzeContent
- 1df9ae9f: Update middleware URL

## 0.19.9

### Patch Changes

- 311a6068: Fix share note link of public space
- 311a6068: Fix public share links

## 0.19.8

### Patch Changes

- 64919a67: Fix extension, portal calls

## 0.19.7

### Patch Changes

- e03a54d4: Fix note cache calls
- 50184d81: Fix Image upload and help modal

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
