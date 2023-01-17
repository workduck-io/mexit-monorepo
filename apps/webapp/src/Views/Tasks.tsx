import { useEffect, useMemo, useState } from 'react'
import { useMatch } from 'react-router-dom'

import { ReminderViewData } from '@mexit/core'
import { Heading, PageContainer, TaskViewSection, ViewType } from '@mexit/shared'

import TaskHeader from '../Components/TaskHeader'
import TodoKanban from '../Components/Todo/TodoKanban'
import TodoList from '../Components/Todo/TodoList'
import { useTodoKanban } from '../Hooks/todo/useTodoKanban'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useTaskViews, useViewStore } from '../Hooks/useTaskViews'
import { useTodoStore } from '../Stores/useTodoStore'

import SearchFilters from './SearchFilters'

const Tasks = () => {
  const nodesTodo = useTodoStore((store) => store.todos)
  const match = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const _hasHydrated = useViewStore((store) => store._hasHydrated)
  const [currentViewType, setCurrentViewType] = useState<ViewType>(ViewType.Kanban)

  const { getView } = useTaskViews()

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])

  const {
    addCurrentFilter,
    changeCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    setCurrentFilters,
    filters,
    currentFilters,
    globalJoin,
    setGlobalJoin
  } = useTodoKanban()

  useEffect(() => {
    if (match && match.params && match.params.viewid) {
      const activeView = currentView ?? getView(match.params.viewid)
      // mog('activeView', { activeView, match, currentView })
      if (match.params.viewid === ReminderViewData.id) {
        setCurrentView(ReminderViewData)
      } else if (activeView) {
        setCurrentView(activeView)
        setCurrentFilters(activeView.filters)
        setGlobalJoin(activeView.globalJoin)
      }
    } else {
      setCurrentView(undefined)
      setCurrentFilters([])
    }
  }, [match, _hasHydrated])

  return (
    <PageContainer>
      <TaskViewSection>
        <TaskHeader
          currentFilters={currentFilters}
          cardSelected={false}
          currentView={currentView}
          globalJoin={globalJoin}
        />
        <SearchFilters
          addCurrentFilter={addCurrentFilter}
          removeCurrentFilter={removeCurrentFilter}
          changeCurrentFilter={changeCurrentFilter}
          resetCurrentFilters={resetCurrentFilters}
          filters={filters}
          currentFilters={currentFilters}
          globalJoin={globalJoin}
          setGlobalJoin={setGlobalJoin}
          viewSelectorProps={{
            currentView: currentViewType,
            onChangeView: (viewType) => {
              setCurrentViewType(viewType)
            },
            availableViews: [ViewType.Kanban, ViewType.List]
          }}
        />
        {
          {
            [ViewType.Kanban]: <TodoKanban />,
            [ViewType.List]: <TodoList todos={nodesTodo} />
          }[currentViewType]
        }
      </TaskViewSection>
      {todos.length < 1 && (
        <div>
          <Heading>No Todos</Heading>
          <p>Use the Editor to add Todos to your nodes. All todos will show up here.</p>
          <p>
            You can add todos with
            <kbd>[]</kbd>
          </p>
          {/* HTML element for keyboard shortcut */}
        </div>
      )}
    </PageContainer>
  )
}

export default Tasks
