import React, { useEffect, useState } from 'react'

import { SharedNode } from '@mexit/core'
import { SharedNodeIcon } from '@mexit/shared'

import { useNavigation } from '../../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../../Hooks/useRouting'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { BList, SItem, SItemContent, SharedBreak } from './styles'

const SharedNotes = () => {
  const sharedNodesS = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()
  const [sharedNodes, setSharedNodes] = useState<SharedNode[]>([])
  const { goTo } = useRouting()
  const node = useEditorStore((s) => s.node)

  useEffect(() => {
    setSharedNodes(sharedNodesS)
  }, [sharedNodesS])

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return (
    <BList>
      {sharedNodes.length > 0 ? (
        <>
          {sharedNodes.map((sharedNode) => {
            return (
              <SItem
                selected={node?.nodeid === sharedNode.nodeid}
                key={`shared_notes_link_${sharedNode.nodeid}`}
                onClick={() => onOpenNode(sharedNode.nodeid)}
              >
                <SItemContent>
                  <SharedNodeIcon />
                  {sharedNode.path}
                </SItemContent>
              </SItem>
            )
          })}

          <SharedBreak />
        </>
      ) : (
        <div>No one shared notes with you (fucking loser) yet!</div>
      )}
    </BList>
  )
}

export default SharedNotes
