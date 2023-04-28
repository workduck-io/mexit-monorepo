import { useMemo, useState } from 'react'

import { API_BASE_URLS, useLayoutStore, useMetadataStore } from '@mexit/core'
import { DrawerHeader, FadeSpan, Group, HighlightNote, HighlightNotes, IconDisplay } from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'

import { QuickActionsDrawerContainer } from './styled'

type LinkedNotesProps = {
  entityId?: string
}

const LinkedNotes: React.FC<LinkedNotesProps> = () => {
  const [showOpen, setShowOpen] = useState<boolean>(null)
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

  const description = `This Capture is linked with ${linkedNotes?.length} note(s).`

  const handleOpenNote = (noteId: string) => {
    // Open Note in new tab
    window.open(`${API_BASE_URLS.frontend}/editor/${noteId}`, '_blank', 'noopener, noreferrer')
  }

  return (
    <QuickActionsDrawerContainer>
      <DrawerHeader title="Linked Notes" description={description} />
      <HighlightNotes>
        {linkedNotes.map((node: any) => {
          const icon = metadata[node.nodeid]?.icon

          return (
            <HighlightNote onMouseEnter={() => setShowOpen(node.nodeid)} onClick={() => handleOpenNote(node.nodeid)}>
              <Group>
                <IconDisplay icon={icon} />
                {getTitleFromPath(node.path)}
              </Group>
              {showOpen === node?.nodeid && <FadeSpan>Open</FadeSpan>}
            </HighlightNote>
          )
        })}
      </HighlightNotes>
    </QuickActionsDrawerContainer>
  )
}

export default LinkedNotes
