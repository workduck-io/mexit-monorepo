import { useMemo } from 'react'

import { API_BASE_URLS, useLayoutStore, useMetadataStore } from '@mexit/core'
import { DrawerHeader, HighlightNote, HighlightNotes, IconDisplay } from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'

import { QuickActionsDrawerContainer } from './styled'

type LinkedNotesProps = {
  entityId?: string
}

const LinkedNotes: React.FC<LinkedNotesProps> = () => {
  const entityId = useLayoutStore((store) => store.drawer.data?.entityId)

  const { getEditableMap } = useHighlights()
  const { getILinkFromNodeid } = useLinks()

  const metadata = useMetadataStore.getState().metadata.notes

  const linkedNotes = useMemo(() => {
    const editableMap = getEditableMap(entityId)

    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [entityId])

  const description = `This highlight is linked with ${linkedNotes?.length} note(s).`

  const handleOpenNote = (noteId: string) => {
    // Open Note in new tab
    window.open(`${API_BASE_URLS.frontend}/editor/${noteId}`, '_blank', 'noopener, noreferrer')
  }

  console.log('linkedNotes', { linkedNotes })

  return (
    <QuickActionsDrawerContainer>
      <DrawerHeader title="Linked Notes" description={description} />
      <HighlightNotes>
        {linkedNotes.map((node: any) => {
          const icon = metadata[node.nodeid]?.icon

          return (
            <HighlightNote onClick={() => handleOpenNote(node.nodeid)}>
              <IconDisplay icon={icon} />
              {getTitleFromPath(node.path)}
            </HighlightNote>
          )
        })}
      </HighlightNotes>
    </QuickActionsDrawerContainer>
  )
}

export default LinkedNotes
