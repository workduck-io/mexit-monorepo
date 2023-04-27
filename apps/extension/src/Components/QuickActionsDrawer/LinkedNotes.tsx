import { useMemo } from 'react'

import { API_BASE_URLS, useMetadataStore } from '@mexit/core'
import { DrawerHeader, HighlightNote, HighlightNotes, IconDisplay } from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'

import { QuickActionsDrawerContainer } from './styled'

type LinkedNotesProps = {
  entityId?: string
}

const LinkedNotes: React.FC<LinkedNotesProps> = ({ entityId }) => {
  const { getEditableMap } = useHighlights()
  const { getILinkFromNodeid } = useLinks()

  const metadata = useMetadataStore.getState().metadata.notes

  const editableMap = getEditableMap(entityId)

  const isEditable = useMemo(() => Object.keys(editableMap ?? {}).length > 0, [editableMap])

  const linkedNotes = useMemo(() => {
    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [editableMap])

  const description = `This highlight is linked with ${linkedNotes?.length} note(s).`

  const handleOpenNote = (noteId: string) => {
    // Open Note in new tab
    window.open(`${API_BASE_URLS.frontend}/editor/${noteId}`, '_blank', 'noopener, noreferrer')
  }

  return (
    <QuickActionsDrawerContainer>
      <DrawerHeader title="Linked Notes" description={description} />
      <HighlightNotes>
        {isEditable
          ? linkedNotes.map((node: any) => {
              const icon = metadata[node.nodeid]?.icon

              return (
                <HighlightNote onClick={() => handleOpenNote(node.nodeid)}>
                  <IconDisplay icon={icon} />
                  {getTitleFromPath(node.path)}
                </HighlightNote>
              )
            })
          : null}
      </HighlightNotes>
    </QuickActionsDrawerContainer>
  )
}

export default LinkedNotes
