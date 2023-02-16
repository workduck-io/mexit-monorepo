import React, { useEffect, useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import { ReminderViewData, View, ViewType } from '@mexit/core'
import { PageContainer, TaskViewSection } from '@mexit/shared'

import TaskHeader from '../Components/TaskHeader'
import ViewRenderer from '../Components/Views/ViewRenderer'
import { useTodoFilters } from '../Hooks/todo/useTodoFilters'
import { useEditorBuffer } from '../Hooks/useEditorBuffer'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useViews } from '../Hooks/useViews'
import { useTodoStore } from '../Stores/useTodoStore'
import { useViewStore } from '../Stores/useViewStore'

import NoResult from './View/NoResult'
import SearchFilters from './SearchFilters'

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
    onViewTypeChange(view.viewType ?? ViewType.List)
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
      onViewTypeChange(ViewType.List)
      onSortOrderChange('ascending')
      setCurrentFilters([])
    }
  }, [match?.params?.viewid, _hasHydrated])

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
        <ViewRenderer viewType={viewType} />
      </TaskViewSection>
      <NoResult items={todos} />
    </PageContainer>
  )
}

export default Tasks
