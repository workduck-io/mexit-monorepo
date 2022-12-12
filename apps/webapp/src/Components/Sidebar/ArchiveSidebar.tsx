import React, { useMemo } from 'react'

import archiveLine from '@iconify/icons-ri/archive-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'

import { useDataStore } from '../../Stores/useDataStore'

import { SidebarHeaderLite } from './Sidebar.space.header'
import { SidebarWrapper } from './Sidebar.style'
import SidebarList from './SidebarList'

const ArchiveSidebar = () => {
  const archiveNotes = useDataStore((store) => store.archive)

  const sortedArchivedNotes = useMemo(() => {
    return archiveNotes
      .sort((a, b) => (a.path < b.path ? 1 : -1))
      .map((note) => ({
        id: note.nodeid,
        label: note.path,
        icon: note.icon ?? fileList2Line,
        data: note
      }))
  }, [archiveNotes])

  return (
    <SidebarWrapper>
      <SidebarHeaderLite title={`Archived Notes (${archiveNotes.length})`} icon={archiveLine} />
      <SidebarList
        items={sortedArchivedNotes}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick={() => {}}
        showSearch
        searchPlaceholder="Filter Archived Notes..."
        emptyMessage="No Archived Notes Found"
      />
    </SidebarWrapper>
  )
}

export default ArchiveSidebar
