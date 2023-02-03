import React, { useEffect, useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import { ReminderViewData, View, ViewType } from '@mexit/core'
import { Heading, PageContainer, TaskViewSection } from '@mexit/shared'

import TaskHeader from '../Components/TaskHeader'
import TodoKanban from '../Components/Todo/TodoKanban'
import TodoList from '../Components/Todo/TodoList'
import { useTodoFilters } from '../Hooks/todo/useTodoFilters'
import { useEditorBuffer } from '../Hooks/useEditorBuffer'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useViews } from '../Hooks/useViews'
import { useTodoStore } from '../Stores/useTodoStore'
import { useViewStore } from '../Stores/useViewStore'

import SearchFilters from './SearchFilters'

const ViewTypeRenderer: React.FC<{ viewType: ViewType }> = ({ viewType }) => {
  switch (viewType) {
    case ViewType.Kanban:
      return <TodoKanban />
    case ViewType.List:
      return <TodoList />
  }
}

const Tasks = () => {
  const nodesTodo = useTodoStore((store) => store.todos)
  const match = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const _hasHydrated = useViewStore((store) => store._hasHydrated)

  const { getView } = useViews()

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])
  const { saveAndClearBuffer } = useEditorBuffer()

  const {
    addCurrentFilter,
    changeCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    setCurrentFilters,
    filters,
    currentFilters,
    globalJoin,
    setGlobalJoin,
    sortOrder,
    sortType,
    viewType,
    onViewTypeChange,
    onSortTypeChange,
    onSortOrderChange
  } = useTodoFilters()

  const setCurrentViewOptions = (view: View) => {
    onViewTypeChange(view.viewType ?? ViewType.Kanban)
    onSortTypeChange(view.sortType ?? 'status')
    onSortOrderChange(view.sortOrder ?? 'ascending')
    setCurrentFilters(view.filters ?? [])
    setGlobalJoin(view.globalJoin)
  }

  useEffect(() => {
    if (match && match.params && match.params.viewid) {
      const activeView = currentView ?? getView(match.params.viewid)
      // mog('activeView', { activeView, match, currentView })
      if (match.params.viewid === ReminderViewData.id) {
        setCurrentView(ReminderViewData)
      } else if (activeView) {
        setCurrentView(activeView)
        setCurrentViewOptions(activeView)
      }
    } else {
      setCurrentView(undefined)
      onSortTypeChange('status')
      onSortOrderChange('ascending')
      setCurrentFilters([])
    }
  }, [match, _hasHydrated])

  useEffect(() => {
    return () => {
      // * On Unmount, Save the buffer
      saveAndClearBuffer()
    }
  }, [])

  return (
    <PageContainer>
      <TaskViewSection>
        <TaskHeader
          sortOrder={sortOrder}
          sortType={sortType}
          currentViewType={viewType}
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
            currentView: viewType,
            onChangeView: (viewType) => {
              onViewTypeChange(viewType)
            },
            availableViews: [ViewType.Kanban, ViewType.List]
          }}
          sortMenuProps={{
            sortOrder,
            sortType,
            onSortTypeChange,
            onSortOrderChange,
            availableSortTypes: ['status', 'priority']
          }}
        />
        <ViewTypeRenderer viewType={viewType} />
      </TaskViewSection>
      {todos.length < 1 && (
        <div>
          <Heading>No Todos</Heading>
          <p>Use the Editor to add Todos to your nodes. All todos will show up here.</p>
          <p>
            You can add todos with
            <kbd>[]</kbd>
          </p>
        </div>
      )}
    </PageContainer>
  )
}

export default Tasks
