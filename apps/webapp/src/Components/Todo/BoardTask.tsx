import React, { useEffect, useMemo } from 'react'

import { ModalsType, mog, PriorityType, useContentStore, useModalStore, useTodoStore, ViewType } from '@mexit/core'
import { PropertiyFields, TaskCard, TaskSuperBlock, Text } from '@mexit/shared'

import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { useSearch } from '../../Hooks/useSearch'

interface RenderTaskProps {
  id: string

  // TODO: Remove dependency on complete todo object
  // Fetch the data from the store instead and refresh the state when the store changes
  todoid: string
  nodeid: string

  selectedCardId?: string | null

  block?: any

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

export const RenderBoardTask = React.memo<RenderTaskProps>(
  ({ id, todoid, block, nodeid, staticBoard, refreshCallback, selectedCardId }: RenderTaskProps) => {
    const documentUpdated = useContentStore((s) => s.docUpdated)
    const getTodoOfNode = useTodoStore((store) => store.getTodoOfNodeWithoutCreating)
    const ref = React.useRef<HTMLDivElement>(null)

    const todo = useMemo(() => getTodoOfNode(nodeid, todoid), [nodeid, todoid, documentUpdated])
    const toggleModal = useModalStore((store) => store.toggleOpen)

    useEffect(() => {
      if (ref.current) {
        if (selectedCardId === id) {
          ref.current.focus()
        } else return
        const el = ref.current

        // is element in viewport
        const rect = el.getBoundingClientRect()
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        if (!isInViewport) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, [selectedCardId])

    

    const { setInfoOfBlockInContent } = useUpdateBlock()
    const { updateBlocks } = useSearch()

    const handleOnChange = (properties: Partial<PropertiyFields>) => {
      const noteId = block.parent

      const updatedBlock = setInfoOfBlockInContent(block.parent, {
        blockId: block.id,
        properties,
        useBuffer: true
      })

      mog('UPDATED BLOCK', { updatedBlock, properties })

      updateBlocks({
        id: noteId,
        contents: [updatedBlock]
      })
    }

    // if (!todo) return null

    const priorityShown = todo?.properties?.priority !== PriorityType.noPriority

    return (
      <TaskCard
        id={`${nodeid}_${todoid}`}
        key={`TODO_PREVIEW_${nodeid}_${todoid}`}
        priorityShown={priorityShown}
        onMouseDown={(event) => {
          if (staticBoard) return
          event.preventDefault()
          if (event.detail === 2) {
            toggleModal(ModalsType.previewNote, { noteId: nodeid, blockId: todoid })
          }
        }}
      >
        <TaskSuperBlock
          id={block.id}
          type={block.type}
          parent={block.parent}
          value={block.data.properties}
          metadata={block.data.metadata}
          onChange={handleOnChange}
          isActive
          isSelected
          isReadOnly={true}
        >
          <Text>{block.text}</Text>
        </TaskSuperBlock>
        {/* <Todo
          showDelete={false}
          todoid={todo.id}
          readOnly={readOnly}
          readOnlyContent
          showPriority
          controls={controls}
          parentNodeId={todo.nodeid}
        >
          <Plateless content={pC} />
        </Todo> */}
      </TaskCard>
    )
  }
)

RenderBoardTask.displayName = 'RenderTask'
