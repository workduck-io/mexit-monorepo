import { useRef } from 'react'

import { ViewType } from '@mexit/core'

import { useLayoutStore } from '../../../Stores/useLayoutStore'

import BlockRenderer from './BlockRenderer'
import { ViewBlockContainer } from './styled'

export type ViewBlockRendererProps = {
  block: any
  selectedBlockId?: string | null

  /** whether the task is in a static kanban board, for example in read only view embeds */
  staticBoard?: boolean

  /** Function to call to refresh the data in the task, after a change */
  refreshCallback?: () => void

  /** Whether the sidebar is currently overlaying the content, needed for width in kanban */
  overlaySidebar?: boolean

  viewType?: ViewType

  /** Whether the card is being dragged, styling */
  dragging?: boolean
}

const ViewBlockRenderer: React.FC<ViewBlockRendererProps> = ({
  block,
  dragging,
  staticBoard,
  viewType,
  overlaySidebar,
  selectedBlockId
}) => {
  const sidebar = useLayoutStore((store) => store.sidebar)

  const ref = useRef<HTMLDivElement>(null)

  return (
    <ViewBlockContainer
      selected={selectedBlockId && selectedBlockId === block.id}
      ref={ref}
      dragging={dragging}
      viewType={viewType}
      staticBoard={staticBoard}
      sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}
    >
      <BlockRenderer block={block} type={block?.doc?.entity} selectedBlockId={selectedBlockId} />
    </ViewBlockContainer>
  )
}

export default ViewBlockRenderer
