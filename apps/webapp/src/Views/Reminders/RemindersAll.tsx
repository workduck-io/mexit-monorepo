import React, { useEffect, useMemo } from 'react'

import Board from '@asseinfo/react-kanban'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'
import create from 'zustand'

import {
  getReminderState,
  mog,
  past,
  Reminder,
  ReminderBoard,
  ReminderBoardCard,
  ReminderBoardColumn,
  SearchFilter,
  upcoming
} from '@mexit/core'
import { PageContainer, MainHeader, Button, IntegrationTitle } from '@mexit/shared'

import { useCreateReminderModal } from '../../Components/Reminders/CreateReminderModal'
import ReminderUI, { reminderStateIcons } from '../../Components/Reminders/Reminder'
import { FilterStore } from '../../Hooks/useFilters'
import { useLinks } from '../../Hooks/useLinks'
import { useReminders } from '../../Hooks/useReminders'
import { useReminderStore } from '../../Stores/useReminderStore'
import SearchFilters from '../SearchFilters'
import { AllRemindersWrapper, ReminderColumnHeader } from './RemindersAll.style'
import { ReminderBoardStyled } from './RemindersAll.style'

interface AllReminderFilterStore extends FilterStore<Reminder> {
  board: ReminderBoard
  setBoard: (board: ReminderBoard) => void
  addCurrentFilter: (filter: SearchFilter<Reminder>) => void
  removeCurrentFilter: (filter: SearchFilter<Reminder>) => void
  resetCurrentFilters: () => void
}

export const useReminderFilter = create<AllReminderFilterStore>((set, get) => ({
  board: { columns: [] },
  setBoard: (board: ReminderBoard) => set({ board }),
  currentFilters: [],
  setCurrentFilters: (filters) => set({ currentFilters: filters }),
  filters: [],
  setFilters: (filters) => set({ filters }),
  addCurrentFilter: (filter) => {
    set({ currentFilters: [...get().currentFilters, filter] })
  },
  removeCurrentFilter: (filter) => {
    set({ currentFilters: get().currentFilters.filter((f) => f.id !== filter.id) })
  },
  resetCurrentFilters: () => {
    set({ currentFilters: [] })
  }
}))

const useReminderFilters = () => {
  const { getPathFromNodeid } = useLinks()
  const { attachBlockData } = useReminders()

  const getRemindersBoard = (): { board: ReminderBoard; filters: SearchFilter<Reminder>[] } => {
    const remindersBase = useReminderStore.getState().reminders
    const currentFilters = useReminderFilter.getState().currentFilters

    const reminders = (
      currentFilters.length > 0
        ? remindersBase.filter((reminder) => {
            return currentFilters.every((filter) => filter.filter(reminder))
          })
        : remindersBase
    ).map((reminder) => {
      return {
        ...reminder,
        path: getPathFromNodeid(reminder.nodeid)
      }
    })

    const upcomingRemindersBase = reminders.filter(upcoming).sort((a, b) => {
      return a.time - b.time
    })

    const pastRemindersBase = reminders.filter(past).sort((a, b) => {
      return b.time - a.time
    })

    const upcomingReminders = upcomingRemindersBase.filter(
      (reminder) => pastRemindersBase.find((r) => r.id === reminder.id && r.state.done === true) === undefined
    )

    const upcomingRemindersColumn: ReminderBoardColumn = {
      id: 'upcoming',
      title: 'Upcoming Reminders',
      cards: upcomingReminders.map(attachBlockData).map((reminder) => ({ id: reminder.id, reminder }))
    }

    const pastReminders = pastRemindersBase.filter(
      (reminder) => upcomingRemindersBase.find((r) => r.id === reminder.id && r.state.done === false) === undefined
    )

    const pastRemindersColumn: ReminderBoardColumn = {
      id: 'past',
      title: 'Past Reminders',
      cards: pastReminders.map(attachBlockData).map((reminder) => ({ id: reminder.id, reminder }))
    }

    const newFilters = getReminderFilters([...upcomingReminders, ...pastReminders])
    mog('NewFilters and Board', { newFilters, upcomingRemindersColumn, pastRemindersColumn })
    // setCurrentFilters(newFilters)
    return {
      board: {
        columns: [upcomingRemindersColumn, pastRemindersColumn]
      },
      filters: newFilters
    }
  }

  const getReminderFilters = (reminders: Reminder[]) => {
    const filters: SearchFilter<Reminder>[] = []
    const nodes = reminders
      .map((reminder) => reminder.nodeid)
      .filter((nodeid, index, self) => self.indexOf(nodeid) === index)

    const nodeCounts = reminders.reduce((acc, reminder) => {
      const nodeid = reminder.nodeid
      if (acc[nodeid]) {
        acc[nodeid] += 1
      } else {
        acc[nodeid] = 1
      }
      return acc
    }, {} as { [nodeid: string]: number })
    nodes.forEach((nodeid) => {
      const path = getPathFromNodeid(nodeid)
      filters.push({
        key: 'note',
        id: nodeid,
        label: path,
        filter: (reminder) => reminder.nodeid === nodeid,
        count: nodeCounts[nodeid],
        icon: 'ri:file-list-line'
      })
    })

    const allStates = { active: 0, snooze: 0, done: 0, missed: 0 }

    reminders.forEach((reminder) => {
      const status = getReminderState(reminder)
      allStates[status] += 1
    })

    Object.entries(allStates)
      .filter(([, count]) => count > 0)
      .forEach(([state, count]) => {
        filters.push({
          key: 'state',
          id: state,
          label: state,
          icon: reminderStateIcons[state],
          count,
          filter: (reminder: Reminder) => getReminderState(reminder) === state
        })
      })

    const todoRemindersLen = reminders.filter((reminder) => reminder.todoid !== undefined).length
    if (todoRemindersLen > 0) {
      filters.push({
        key: 'has',
        id: 'block_todo',
        label: 'Task',
        icon: 'ri:ri-task-line',
        count: todoRemindersLen,
        filter: (reminder: Reminder) => reminder.todoid !== undefined
      })
    }

    mog('Filters', { filters })

    return filters
  }

  const applyFilters = (reminders: Reminder[]) => {
    const currentFilters = useReminderFilter.getState().currentFilters
    return reminders.filter((reminder) => {
      return currentFilters.every((filter) => filter.filter(reminder))
    })
  }

  return {
    getReminderFilters,
    getRemindersBoard,
    applyFilters
  }
}

const RemindersAll = () => {
  const openModal = useCreateReminderModal((state) => state.openModal)
  const reminders = useReminderStore((s) => s.reminders)
  const addCurrentFilter = useReminderFilter((s) => s.addCurrentFilter)
  const removeCurrentFilter = useReminderFilter((s) => s.removeCurrentFilter)
  const resetCurrentFilters = useReminderFilter((s) => s.resetCurrentFilters)
  // const filters = useReminderFilter((s) => s.currentFilters)
  const currentFilters = useReminderFilter((s) => s.currentFilters)
  const armedReminders = useReminderStore((s) => s.armedReminders)
  // const setBoard = useReminderFilter((s) => s.setBoard)
  // const setFilters = useReminderFilter((s) => s.setFilters)
  const { getRemindersBoard } = useReminderFilters()

  const { board, filters } = useMemo(() => {
    const { board, filters } = getRemindersBoard()
    // setFilters(newFilters)
    // mog('Setting Board', { newFilters })
    return { board, filters }
  }, [reminders, armedReminders, currentFilters])

  // useEffect(() => {
  //   const { board, filters } = getRemindersBoard()
  //   setBoard(board)
  //   setCurrentFilters(filters)
  // }, [reminders])

  const handleCardMove = (card, source, destination) => {
    mog('card moved', { card, source, destination })
    // changeStatus(card.todo, destination.toColumnId)
    // const newReminders = [...reminders]
    // const cardIndex = newReminders.findIndex((c) => c.id === card.id)
    // const cardToMove = newReminders[cardIndex]
    // newReminders.splice(cardIndex, 1)
    // newReminders.splice(to, 0, cardToMove)
    // addReminders(newReminders)
  }

  const RenderCard = ({ id, reminder }: ReminderBoardCard, { dragging }: { dragging: boolean }) => {
    // const pC = getPureContent(todo)
    const { getReminderControls } = useReminders()
    // mog('RenderTodo', { id, todo, dragging })
    return (
      <ReminderUI
        showNodeInfo
        controls={getReminderControls(reminder)}
        key={`ReultForSearch_${reminder.id}_${id}`}
        reminder={reminder}
      />
    )
  }

  // mog('RemindersAll', { reminders, board, filters, currentFilters })

  return (
    <PageContainer>
      <MainHeader>
        <IntegrationTitle>Reminders</IntegrationTitle>
        <Button
          // large
          primary
          onClick={() => openModal()}
        >
          <Icon icon={addCircleLine} />
          Create Reminder
        </Button>
      </MainHeader>
      <AllRemindersWrapper>
        <SearchFilters
          result={board}
          addCurrentFilter={addCurrentFilter}
          removeCurrentFilter={removeCurrentFilter}
          resetCurrentFilters={resetCurrentFilters}
          filters={filters}
          currentFilters={currentFilters}
        />
        <ReminderBoardStyled>
          <Board
            renderColumnHeader={({ title }) => <ReminderColumnHeader>{title}</ReminderColumnHeader>}
            disableColumnDrag
            disableCardDrag
            onCardDragEnd={handleCardMove}
            renderCard={RenderCard}
          >
            {board}
          </Board>
        </ReminderBoardStyled>
      </AllRemindersWrapper>
    </PageContainer>
  )
}

export default RemindersAll
