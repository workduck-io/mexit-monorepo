import React from 'react'

export const OutlineHelp = (
  <div>
    <h1>Outline</h1>
    <p>Outline of the note.</p>
    <p>Click on the block to navigate to it.</p>
  </div>
)

export const TagsHelp = (
  <div>
    <h1>Tags</h1>
    <p>Tags present in the note.</p>
    <p>Click on the tag to see all notes related to it.</p>
    <p>Notes that share same tags appear in the Related Notes.</p>
  </div>
)

const GenericNodeLinkHelp = () => (
  <div>
    <p>Hover over note to preview temporarily, Click to preserve preview and interact.</p>
    <p>Click twice on the note to navigate.</p>
  </div>
)

export const BacklinksHelp = (
  <div>
    <h1>Backlinks</h1>
    <p>Notes that reference current note.</p>
    <GenericNodeLinkHelp />
    <p>Click on the title to switch to Forwardlinks</p>
  </div>
)

export const ForwardlinksHelp = (
  <div>
    <h1>Forwardlinks</h1>
    <p>Notes that are referenced from the current note.</p>
    <GenericNodeLinkHelp />
    <p>Click on the title to switch to Backlinks</p>
  </div>
)

export const TreeHelp = (
  <div>
    <h1>Notes</h1>
    <p>All of your notes in a hierarchal(nested) structure.</p>
    <p>Click on note to navigate</p>
    <p>The note is sorted by it&#39;s creation time.</p>
  </div>
)

export const BookmarksHelp = (
  <div>
    <h1>Bookmarks</h1>
    <p>Your bookmarked notes.</p>
    <p>Use the bookmark button to bookmark a note.</p>
  </div>
)
export const SharedHelp = (
  <div>
    <h1>Shared Notes</h1>
    <p>Notes that have been shared with you.</p>
    <p>You can edit the note if you have manage or edit access.</p>
  </div>
)

export const SearchFiltersHelp = (
  <div>
    <h1>Search Filters</h1>
    <p>Number of results matching a filter are indicated by the number beside it.</p>
    <p>Click on a filter to apply/remove it.</p>
    <p>Use the input to search and apply/remove a filter.</p>
  </div>
)

export const SearchHelp = (
  <div>
    <h1>Search</h1>
    <p>Search for text within your notes.</p>
    <p>Switch view of results with the toggle</p>
  </div>
)

export const SnippetHelp = (
  <div>
    <h1>Snippets</h1>
    <p>Create snippets to use in notes.</p>
  </div>
)

export const TasksHelp = (
  <div>
    <h1>Tasks</h1>
    <p>All the tasks from your notes appear here.</p>
    <p>Tasks are sorted by priority and grouped by their status.</p>
    <p>Drag and drop or use the checkbox to change status.</p>
    <p>Tasks can be filtered by the notes they appear in.</p>
  </div>
)
export const ArchiveHelp = (
  <div>
    <h1>Archive</h1>
    <p>Archived notes appear here.</p>
    <p>You can unarchive an archived note or delete it permanently.</p>
  </div>
)
