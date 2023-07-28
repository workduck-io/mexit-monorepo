/* eslint-disable no-case-declarations */
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useMediaQuery } from 'react-responsive'
import { useMatch } from 'react-router-dom'

import Board from '@asseinfo/react-kanban'
import { get } from 'lodash'
import { useTheme } from 'styled-components'

import { Indexes, SearchResult } from '@workduck-io/mex-search'
import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import {
  MoveBlocksType,
  PriorityType,
  SEPARATOR,
  SuperBlocks,
  useLayoutStore,
  useModalStore,
  useMultipleEditors,
  useTodoStore
} from '@mexit/core'
import {
  Count,
  Description,
  Group,
  GroupHeader,
  IconDisplay,
  OverlaySidebarWindowWidth,
  StyledTasksKanban,
  TaskColumnHeader,
  TaskListWrapper
} from '@mexit/shared'

import useUpdateBlock from '../../../Editor/Hooks/useUpdateBlock'
import { useViewFilterStore } from '../../../Hooks/todo/useTodoFilters'
import { KanbanBoardColumn, useTodoKanban } from '../../../Hooks/todo/useTodoKanban'
import { useEnableShortcutHandler } from '../../../Hooks/useChangeShortcutListener'
import useGroupHelper from '../../../Hooks/useGroupHelper'
import { useNavigation } from '../../../Hooks/useNavigation'
import { isReadonly, usePermissions } from '../../../Hooks/usePermissions'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useSearch } from '../../../Hooks/useSearch'
import { convertValueToTasks } from '../../../Utils/convertValueToTasks'
import { getBlock } from '../../../Utils/parseData'
import ViewBlockRenderer from '../ViewBlockRenderer'

/**
 * TodoKanban
 * With shortcuts and navigation
 */

const KanbanView: React.FC<any> = (props) => {
  const [selectedCard, setSelectedCard] = React.useState<SearchResult | null>(null)
  const groupBy = useViewFilterStore((s) => s.groupBy)

  const isModalOpen = useModalStore((store) => store.open)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  const atViews = useMatch(`${ROUTE_PATHS.view}/*`)
  const { getBlocksBoard } = useTodoKanban()

  const { goTo } = useRouting()
  const { push } = useNavigation()
  const { moveBlocksInIndex, updateBlocks, removeDocument } = useSearch()
  const appendTodos = useTodoStore((store) => store.appendTodos)

  const { moveBlockFromNode, insertInNote, setInfoOfBlockInContent } = useUpdateBlock()
  const { accessWhenShared } = usePermissions()
  const { enableShortcutHandler } = useEnableShortcutHandler()
  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const board = useMemo(() => {
    return getBlocksBoard(props.results)
  }, [props.results])

  const checkIsNoteReadOnly = (noteId: string) => {
    return isReadonly(accessWhenShared(noteId))
  }

  const handleBlockEvents = (block: SearchResult, field: string, move: { fromColumnId: any; toColumnId: any }) => {
    if (!block || !field || move.toColumnId === 'Ungrouped') return

    const noteId: string = block.parent
    const blockField = field?.split(SEPARATOR)?.at(-1)
    const blockContent = getBlock(noteId, block.id)

    if (blockContent) {
      switch (blockField) {
        case 'status':
        case 'priority':
        case 'entity':
          const content = convertValueToTasks(
            [blockContent],
            blockField === 'entity'
              ? {}
              : {
                [blockField]: move.toColumnId
              }
          )

          insertInNote(block.parent, block.id, content)
          appendTodos(noteId, content)

          removeDocument(Indexes.MAIN, block.id)
          updateBlocks({
            id: noteId,
            contents: content
          })
          break

        case 'parent':
          const hasPermission = !checkIsNoteReadOnly(move.toColumnId)

          if (!hasPermission) {
            toast('You do not have permission to move this block')
            return
          }

          const updated = moveBlockFromNode(move.fromColumnId, move.toColumnId, blockContent)

          if (updated) {
            const moveBlockRequest: MoveBlocksType = {
              toNodeId: move.toColumnId,
              fromNodeId: move.fromColumnId,
              blockIds: [block.id],
              indexKey: Indexes.MAIN
            }

            moveBlocksInIndex(moveBlockRequest)
          }
          break
      }
    }
  }

  const handleTaskEvents = (block: SearchResult, field: string, move: { fromColumnId: any; toColumnId: any }) => {
    if (!block || !field || move.toColumnId === 'Ungrouped') return

    const noteId = block.parent
    const todoField = field?.split(SEPARATOR)?.at(-1)

    switch (todoField) {
      case 'priority':
        const blockWithNewPriority = setInfoOfBlockInContent(noteId, {
          blockId: block.id,
          properties: {
            priority: move.toColumnId
          }
        })
        updateBlocks({
          id: noteId,
          contents: [blockWithNewPriority]
        })
        break
      case 'status':
        const blockWithNewStatus = setInfoOfBlockInContent(noteId, {
          blockId: block.id,
          properties: {
            status: move.toColumnId
          }
        })
        updateBlocks({
          id: noteId,
          contents: [blockWithNewStatus]
        })
        break
      case 'entity':
        const updatedBlock = setInfoOfBlockInContent(noteId, {
          blockId: block.id,
          blockData: {
            type: SuperBlocks.CONTENT
          },
          useBuffer: true
        })
        updateBlocks({
          id: noteId,
          contents: [updatedBlock]
        })
        break
      case 'parent':
        const hasPermission = !checkIsNoteReadOnly(move.toColumnId)

        if (!hasPermission) {
          toast('You do not have permission to move this block')
          return
        }

        const blockContent = getBlock(noteId, block.id)

        if (blockContent) {
          const updated = moveBlockFromNode(move.fromColumnId, move.toColumnId, blockContent)

          if (updated) {
            const moveBlockRequest: MoveBlocksType = {
              toNodeId: move.toColumnId,
              fromNodeId: move.fromColumnId,
              blockIds: [block.id],
              indexKey: Indexes.MAIN
            }
            // moveTodo(todo.id, move.fromColumnId, move.toColumnId)
            moveBlocksInIndex(moveBlockRequest)
          }
        }
    }
  }

  const handleCardMove = (card, { fromColumnId }, { toColumnId }) => {
    const hasOnlyReadPermission = checkIsNoteReadOnly(card.parent)

    if (hasOnlyReadPermission) {
      toast('You do not have permission to move this block')
      return
    }

    if (fromColumnId !== toColumnId) {
      switch (card.entity) {
        case SuperBlocks.TASK:
          handleTaskEvents(card, groupBy, { fromColumnId, toColumnId })
          break
        case SuperBlocks.CONTENT:
          handleBlockEvents(card, groupBy, { fromColumnId, toColumnId })
          break
      }
    }
  }

  const onNavigateToNode = () => {
    if (!selectedCard) {
      return
    }

    const nodeid = selectedCard?.parent
    push(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const selectFirst = () => {
    const firstCardColumn = board.columns.find((column) => column.cards.length > 0)

    if (firstCardColumn) {
      if (firstCardColumn.cards) {
        const firstCard = firstCardColumn.cards[0]
        setSelectedCard(firstCard)
      }
    }
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCard) return

    handleCardMove(selectedCard, { fromColumnId: 'priority' }, { toColumnId: priority })
  }

  const selectNewCard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) {
      selectFirst()
      return
    }

    const selectedColumn = board.columns.find((column) => {
      const columnId = get(selectedCard, groupBy) ?? 'Ungrouped'
      return column.id === columnId
    }) as KanbanBoardColumn

    if (!selectedColumn) {
      selectFirst()
      return
    }

    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex(
      (card) => card.id === selectedCard.id && card.parent === selectedCard.parent
    )

    switch (direction) {
      case 'up': {
        const prevCard = selectedColumn.cards[(selectedIndex - 1 + selectedColumnLength) % selectedColumnLength]

        if (prevCard) {
          setSelectedCard(prevCard)
        }
        break
      }

      case 'down': {
        const nextCard = selectedColumn.cards[(selectedIndex + 1) % selectedColumnLength]
        if (nextCard) {
          setSelectedCard(nextCard)
        }
        break
      }

      case 'left': {
        let selectedColumnId = selectedColumn.id
        let prevCard = undefined
        while (!prevCard) {
          const prevColumnIndex =
            (board.columns.findIndex((col) => col.id === selectedColumn.id) - 1 + board.columns.length) %
            board.columns.length
          const prevColumn = board.columns[prevColumnIndex]

          if (!prevColumn || prevColumn.id === selectedColumn.id) break
          prevCard = prevColumn.cards[selectedIndex % prevColumn.cards.length]
          selectedColumnId = prevColumn.id
        }
        if (prevCard) {
          // mog('selected card', { selectedCard, prevCard })
          setSelectedCard(prevCard)
        }
        break
      }

      case 'right': {
        let selectedColumnId = selectedColumn.id
        let nextCard = undefined
        while (!nextCard) {
          const nextColumnIndex =
            (board.columns.findIndex((col) => selectedColumn.id === col.id) + 1) % board.columns.length
          const nextColumn = board.columns[nextColumnIndex]

          if (!nextColumn || nextColumn.id === selectedColumn.id) break
          nextCard = nextColumn.cards[selectedIndex % nextColumn.cards.length]
          selectedColumnId = nextColumn.id
        }
        if (nextCard) {
          setSelectedCard(nextCard)
        }
        break
      }
    }
  }

  const eventWrapper = (fn: (event) => void): ((event) => void) => {
    return (e) => {
      enableShortcutHandler(() => {
        e.preventDefault()
        fn(e)
      })
    }
  }

  const wrapEvents = (map: KeyBindingMap) =>
    Object.entries(map).reduce((acc, [key, value]) => {
      acc[key] = eventWrapper(value)
      return acc
    }, {})

  useEffect(() => {
    const shorcutConfig = (): KeyBindingMap => {
      if (isModalOpen !== undefined || !atViews) return {}

      return wrapEvents({
        Escape: () => {
          if (selectedCard) setSelectedCard(null)
        },

        // 'Shift+ArrowRight': () => handleCardMoveNext(),
        // 'Shift+ArrowLeft': () => handleCardMovePrev(),

        ArrowRight: () => selectNewCard('right'),
        ArrowLeft: () => selectNewCard('left'),
        ArrowDown: () => selectNewCard('down'),
        ArrowUp: () => selectNewCard('up'),

        '$mod+1': () => changeSelectedPriority(PriorityType.low),
        '$mod+2': () => changeSelectedPriority(PriorityType.medium),
        '$mod+3': () => changeSelectedPriority(PriorityType.high),
        '$mod+0': () => changeSelectedPriority(PriorityType.noPriority),

        '$mod+Enter': () => onNavigateToNode()
      })
    }

    if (!isPreviewEditors || (isPreviewEditors && !Object.entries(isPreviewEditors).length)) {
      const unsubscribe = tinykeys(window, shorcutConfig())

      return () => {
        unsubscribe()
      }
    }
  }, [board, selectedCard, isModalOpen, isPreviewEditors, atViews])

  const RenderCard = (block, { dragging }: { dragging: boolean }) => {
    return (
      <ViewBlockRenderer
        onClick={(card: SearchResult) => setSelectedCard(card)}
        key={`${block?.id}-${block?.parent}`}
        selectedBlockId={selectedCard?.id}
        block={block}
      />
    )
  }

  const ColumnHeader = (props) => {
    const theme = useTheme()
    const [group, setGroup] = useState(null)

    const { getResultGroup } = useGroupHelper()

    useEffect(() => {
      getResultGroup(props.id, groupBy).then((res) => {
        setGroup(res)
      })
    }, [])

    const count = board.columns?.find((column) => column.id === props.id)?.cards?.length

    if (!group) return

    return (
      <TaskColumnHeader>
        <GroupHeader>
          <Group>
            <IconDisplay icon={group.icon} color={theme.tokens.colors.primary.default} />
            <span>{group.label}</span>
            {count && <Count>{count}</Count>}
          </Group>
        </GroupHeader>
      </TaskColumnHeader>
    )
  }

  if (!board?.columns?.length)
    return (
      <TaskListWrapper>
        <Description>
          Could not find any results for your search, please try again with different search terms.
        </Description>
      </TaskListWrapper>
    )

  return (
    <StyledTasksKanban sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}>
      {!!board && (
        <Board
          renderColumnHeader={ColumnHeader}
          disableColumnDrag
          disableCardDrag={!atViews}
          onCardDragEnd={handleCardMove}
          renderCard={RenderCard}
        >
          {board}
        </Board>
      )}
    </StyledTasksKanban>
  )
}

export default KanbanView
