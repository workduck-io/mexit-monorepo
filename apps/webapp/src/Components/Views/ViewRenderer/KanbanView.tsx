import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMediaQuery } from 'react-responsive'

import Board from '@asseinfo/react-kanban'
import { useTheme } from 'styled-components'

import { SearchResult } from '@workduck-io/mex-search'
import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import { getNextStatus, getPrevStatus, mog, PriorityType } from '@mexit/core'
import {
  Count,
  Group,
  GroupHeader,
  IconDisplay,
  OverlaySidebarWindowWidth,
  StyledTasksKanban,
  TaskColumnHeader
} from '@mexit/shared'

import { useViewFilters as useFilters, useViewFilterStore } from '../../../Hooks/todo/useTodoFilters'
import { KanbanBoardColumn, useTodoKanban } from '../../../Hooks/todo/useTodoKanban'
import { useEnableShortcutHandler } from '../../../Hooks/useChangeShortcutListener'
import useGroupHelper from '../../../Hooks/useGroupHelper'
import { useNavigation } from '../../../Hooks/useNavigation'
import { isReadonly, usePermissions } from '../../../Hooks/usePermissions'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import { useLayoutStore } from '../../../Stores/useLayoutStore'
import useModalStore from '../../../Stores/useModalStore'
import ViewBlockRenderer from '../ViewBlockRenderer'

/**
 * TodoKanban
 * With shortcuts and navigation
 */

const KanbanView: React.FC<any> = (props) => {
  const [board, setBoard] = useState<any>({ columns: [] })
  const [selectedCard, setSelectedCard] = React.useState<SearchResult | null>(null)

  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)
  const sidebar = useLayoutStore((store) => store.sidebar)

  const { getBlocksBoard, changeStatus, changePriority } = useTodoKanban()
  const { globalJoin, currentFilters, sortOrder, sortType } = useFilters()

  const entities = useViewFilterStore((store) => store.entities)

  const { push } = useNavigation()
  const { goTo } = useRouting()

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })
  const { accessWhenShared } = usePermissions()

  useEffect(() => {
    setBoard(getBlocksBoard(props.results))
  }, [globalJoin, currentFilters, entities, sortOrder, sortType])

  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  const handleCardMove = (card, source, destination) => {
    const todoFromCard = getTodoFromCard(card)
    const readOnly = todoFromCard?.nodeid && isReadonly(accessWhenShared(todoFromCard?.nodeid))
    // mog('card moved', { card, source, destination, readOnly })
    if (!readOnly) {
      // mog('new status', { newStatus, todoFromCard, selectedCard })
      changeStatus(todoFromCard, destination.toColumnId)
    } else {
      toast('Cannot move task in a note with Read only permission')
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

  const handleCardMoveNext = () => {
    if (!selectedCard) return
    const todoFromCard = getTodoFromCard(selectedCard)
    const newStatus = getNextStatus(todoFromCard.metadata.status)
    changeStatus(todoFromCard, newStatus)
  }

  const handleCardMovePrev = () => {
    if (!selectedCard) return
    const todoFromCard = getTodoFromCard(selectedCard)
    const newStatus = getPrevStatus(todoFromCard.metadata.status)
    // mog('new status', { newStatus, todoFromCard, selectedCard })
    changeStatus(todoFromCard, newStatus)
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCard) return
    const todoFromCard = getTodoFromCard(selectedCard)
    changePriority(todoFromCard, priority)
  }

  const selectNewCard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) {
      selectFirst()
      return
    }

    const selectedColumn = board.columns.find((column) => column.id === selectedCard.entity) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex(
      (card) => card.id === selectedCard.id && card.parent === selectedCard.parent
    )

    // mog('selected card', { selectedCard, selectedColumn, selectedColumnLength, selectedIndex, direction })

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
        mog('nextCard', { nextCard, selectedColumn, selectedColumnLength, selectedIndex })
        if (nextCard) {
          // mog('selected card', { selectedCard, nextCard })
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
          // mog('selected card', { selectedCard, nextCard })
          setSelectedCard(nextCard)
        }
        break
      }
    }
  }

  const eventWrapper = (fn: (event) => void): ((event) => void) => {
    return (e) => {
      console.log('event', { e })
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
      if (isModalOpen !== undefined) return {}

      return wrapEvents({
        Escape: () => {
          if (selectedCard) setSelectedCard(null)
        },

        'Shift+ArrowRight': () => handleCardMoveNext(),
        'Shift+ArrowLeft': () => handleCardMovePrev(),

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
  }, [board, selectedCard, isModalOpen, isPreviewEditors])

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
    const { getResultGroup } = useGroupHelper()
    const groupBy = useViewFilterStore((store) => store.groupBy)

    const group = getResultGroup(props.id, groupBy)
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

  return (
    <StyledTasksKanban sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}>
      {!!board && (
        <Board
          renderColumnHeader={ColumnHeader}
          disableColumnDrag
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
