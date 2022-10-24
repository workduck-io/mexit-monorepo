import { useEffect, useMemo } from 'react'

import Board from '@asseinfo/react-kanban'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import { Icon } from '@iconify/react'
import { useMediaQuery } from 'react-responsive'
import create from 'zustand'

import { Button } from '@workduck-io/mex-components'

import {
  Filter,
  Filters,
  FilterTypeWithOptions,
  getReminderState,
  mog,
  past,
  Reminder,
  ReminderBoard,
  ReminderBoardCard,
  ReminderBoardColumn,
  reminderViewPlaceholderData,
  upcoming
} from '@mexit/core'
import {
  OverlaySidebarWindowWidth,
  PageContainer,
  reminderStateIcons,
  ReminderUI,
  StyledTasksKanban,
  TaskHeader as StyledTaskHeader,
  TaskHeaderIcon,
  TaskHeaderTitleSection,
  TaskViewHeaderWrapper,
  TaskViewTitle
} from '@mexit/shared'

import { useCreateReminderModal } from '../../Components/Reminders/CreateReminderModal'
import { useReminderAPI } from '../../Hooks/API/useReminderAPI'
import { reminderFilterFunctions } from '../../Hooks/useFilterFunctions'
import { FilterStore } from '../../Hooks/useFilters'
import { useLinks } from '../../Hooks/useLinks'
import { useReminders } from '../../Hooks/useReminders'
import { useViewStore } from '../../Hooks/useTaskViews'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useReminderStore } from '../../Stores/useReminderStore'
import SearchFilters from '../SearchFilters'
import { AllRemindersWrapper, ReminderBoardStyled, ReminderColumnHeader } from './RemindersAll.style'

interface AllReminderFilterStore extends FilterStore {
  board: ReminderBoard
  setBoard: (board: ReminderBoard) => void
  addCurrentFilter: (filter: Filter) => void
  removeCurrentFilter: (filter: Filter) => void
  resetCurrentFilters: () => void
}

export const useReminderFilter = create<AllReminderFilterStore>((set, get) => ({
  board: { columns: [] },
  setBoard: (board: ReminderBoard) => set({ board }),
  currentFilters: [],
  setCurrentFilters: (filters) => set({ currentFilters: filters }),
  filters: [],
  setFilters: (filters) => set({ filters }),
  globalJoin: 'all',
  setGlobalJoin: (join) => set({ globalJoin: join }),
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
  const setCurrentFilters = useReminderFilter((state) => state.setCurrentFilters)
  const globalJoin = useReminderFilter((state) => state.globalJoin)

  const changeCurrentFilter = (filter: Filter) => {
    const currentFilters = useReminderFilter.getState().currentFilters
    setCurrentFilters(currentFilters.map((f) => (f.id === filter.id ? filter : f)))
  }

  const getRemindersBoard = (): { board: ReminderBoard; filters: Filters } => {
    const remindersBase = useReminderStore.getState().reminders
    const currentFilters = useReminderFilter.getState().currentFilters

    mog('remindersBase', { remindersBase, currentFilters })

    const reminders = (
      currentFilters.length > 0
        ? remindersBase.filter((reminder) => {
            return currentFilters.every(
              (filter) => {
                // const filterFunction = reminderFilterFunctions[ filter.key ]
                // mog('filter', { filter, reminder })
                return reminderFilterFunctions[filter.type](reminder, filter)
              }
              // filter.filter(reminder)
            )
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
    // mog('NewFilters and Board', { newFilters, upcomingRemindersColumn, pastRemindersColumn })
    // setCurrentFilters(newFilters)
    return {
      board: {
        columns: [upcomingRemindersColumn, pastRemindersColumn]
      },
      filters: newFilters
    }
  }

  const getReminderFilters = (reminders: Reminder[]) => {
    const filters: Filters = []
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

    const nodeFilters: FilterTypeWithOptions = {
      type: 'note',
      label: 'Note',
      options: nodes.map((nodeid) => {
        const path = getPathFromNodeid(nodeid)
        return {
          id: nodeid,
          label: path,
          value: nodeid,
          count: nodeCounts[nodeid]
        }
      })
    }
    filters.push(nodeFilters)

    const allStates = { active: 0, snooze: 0, done: 0, missed: 0 }

    reminders.forEach((reminder) => {
      const status = getReminderState(reminder)
      allStates[status] += 1
    })

    const stateFilters: FilterTypeWithOptions = {
      type: 'state',
      label: 'State',
      options: Object.entries(allStates)
        .filter(([, count]) => count > 0)
        .map(([state, count]) => ({
          key: 'state',
          id: state,
          label: state,
          icon: { type: 'ICON', value: reminderStateIcons[state] },
          count,
          value: state
          // filter: (reminder: Reminder) => getReminderState(reminder) === state
        }))
    }

    filters.push(stateFilters)

    const todoRemindersLen = reminders.filter((reminder) => reminder.todoid !== undefined).length
    if (todoRemindersLen > 0) {
      filters.push({
        type: 'has',
        label: 'Has',
        options: [
          {
            id: 'block_todo',
            label: 'Task',
            //'ri:ri-task-line',
            count: todoRemindersLen,
            value: 'todo'
          }
        ]
        // filter: (reminder: Reminder) => reminder.todoid !== undefined
      })
    }

    // mog('Filters', { filters })

    return filters
  }

  const applyFilters = (reminders: Reminder[]) => {
    const currentFilters = useReminderFilter.getState().currentFilters
    return reminders.filter((reminder) => {
      if (globalJoin === 'all') {
        return currentFilters.every(
          (filter) => reminderFilterFunctions[filter.type](reminder, filter)
          // filter.filter(reminder)
        )
      } else
        return currentFilters.some(
          (filter) => reminderFilterFunctions[filter.type](reminder, filter)
          // filter.filter(reminder)
        )
    })
  }

  return {
    getReminderFilters,
    getRemindersBoard,
    changeCurrentFilter,
    applyFilters
  }
}

const RemindersAll = () => {
  const openModal = useCreateReminderModal((state) => state.openModal)
  const reminders = useReminderStore((s) => s.reminders)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const addCurrentFilter = useReminderFilter((s) => s.addCurrentFilter)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const setReminders = useReminderStore((s) => s.setReminders)
  const removeCurrentFilter = useReminderFilter((s) => s.removeCurrentFilter)
  const resetCurrentFilters = useReminderFilter((s) => s.resetCurrentFilters)
  const currentFilters = useReminderFilter((s) => s.currentFilters)
  const armedReminders = useReminderStore((s) => s.armedReminders)
  const { getAllWorkspaceReminders } = useReminderAPI()
  const { getRemindersBoard, changeCurrentFilter } = useReminderFilters()

  const globalJoin = useReminderFilter((s) => s.globalJoin)
  const setGlobalJoin = useReminderFilter((s) => s.setGlobalJoin)

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  useEffect(() => {
    getAllWorkspaceReminders().then((remindersData: { Items: any[] }) => {
      const reminders = remindersData?.Items?.map((reminder) => reminder.properties as Reminder)
      mog('Got reminders', {
        remindersData,
        reminders
      })
      if (reminders) {
        setReminders(reminders)
      }
    })
    setCurrentView(reminderViewPlaceholderData)
  }, [])

  const { board, filters } = useMemo(() => {
    const { board, filters } = getRemindersBoard()
    mog('Board and Filters', { board, filters })

    return { board, filters }
  }, [reminders, armedReminders, currentFilters])

  const handleCardMove = (card, source, destination) => {
    mog('card moved', { card, source, destination })
  }

  const RenderCard = ({ id, reminder }: ReminderBoardCard, { dragging }: { dragging: boolean }) => {
    const { getReminderControls } = useReminders()

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
      <StyledTasksKanban sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}>
        <StyledTaskHeader>
          <TaskHeaderTitleSection>
            <TaskViewHeaderWrapper>
              <TaskHeaderIcon>
                <Icon icon={timerFlashLine} />
              </TaskHeaderIcon>
              <TaskViewTitle>Reminders</TaskViewTitle>
              <Button
                // large
                primary
                onClick={() => openModal()}
              >
                <Icon icon={addCircleLine} />
                Create Reminder
              </Button>
            </TaskViewHeaderWrapper>
          </TaskHeaderTitleSection>
        </StyledTaskHeader>
        <AllRemindersWrapper>
          <SearchFilters
            result={board}
            addCurrentFilter={addCurrentFilter}
            removeCurrentFilter={removeCurrentFilter}
            resetCurrentFilters={resetCurrentFilters}
            changeCurrentFilter={changeCurrentFilter}
            filters={filters}
            currentFilters={currentFilters}
            globalJoin={globalJoin}
            setGlobalJoin={setGlobalJoin}
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
      </StyledTasksKanban>
    </PageContainer>
  )
}

export default RemindersAll
