import React from 'react'
import { useTheme } from 'styled-components'

import { mog, SharedNode } from '@mexit/core'
import { Centered, SharedNodeIcon, useTimout } from '@mexit/shared'

import { useNavigation } from '../../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../../Hooks/useRouting'
import { useDataStore } from '../../../Stores/useDataStore'
import { useEditorStore } from '../../../Stores/useEditorStore'
import { BList, SItem, SItemContent } from './styles'
import { usePermission } from '../../../Hooks/API/usePermission'
import { usePolling } from '../../../Hooks/API/usePolling'

const SharedNotes = () => {
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()
  const { getAllSharedNodes } = usePermission()

  // const [sharedNodes, setSharedNodes] = useState<SharedNode[]>([])
  const { goTo } = useRouting()
  const theme = useTheme()
  const node = useEditorStore((s) => s.node)

  usePolling()

  useTimout(() => {
    getAllSharedNodes().then(() => mog('Fetched shared Notes after 15 secs'))
  }, 15 * 1000)

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

          {/* <SharedBreak /> */}
        </>
      ) : (
        <Centered>
          <SharedNodeIcon height={22} width={22} fill={theme.colors.text.heading} margin="0 0 1rem 0" />
          <span>No one has shared Notes with you yet!</span>
        </Centered>
      )}
    </BList>
  )
}

export default SharedNotes
