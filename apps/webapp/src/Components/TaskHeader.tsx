import { useMemo, useState } from 'react'

import trashIcon from '@iconify/icons-codicon/trash'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import arrowLeftRightLine from '@iconify/icons-ri/arrow-left-right-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import dragMove2Fill from '@iconify/icons-ri/drag-move-2-fill'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'

import {
  Button,
  DisplayShortcut,
  IconButton,
  Infobox,
  LoadingButton,
  ToolbarTooltip
} from '@workduck-io/mex-components'

import { Filter, GlobalFilterJoin, SortOrder, SortType } from '@mexit/core'
import {
  ShortcutToken,
  ShortcutTokens,
  TaskHeader as StyledTaskHeader,
  TaskHeaderIcon,
  TaskHeaderTitleSection,
  TasksHelp,
  TaskViewControls,
  TaskViewHeaderWrapper,
  TaskViewTitle,
  Title,
  ViewType
} from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useTaskViews, useViewStore, View } from '../Hooks/useTaskViews'

import { useTaskViewModalStore } from './TaskViewModal'

interface TaskHeaderProps {
  currentView?: View
  currentFilters: Filter[]
  cardSelected: boolean
  globalJoin: GlobalFilterJoin
  currentViewType: ViewType
  sortOrder: SortOrder
  sortType: SortType
}

const TaskHeader = ({
  currentView,
  currentViewType,
  sortOrder,
  sortType,
  currentFilters,
  cardSelected,
  globalJoin
}: TaskHeaderProps) => {
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { deleteView } = useTaskViews()

  const { goTo } = useRouting()

  const [source, target] = useSingleton()
  const [deleting, setDeleting] = useState(false)

  const isCurrentViewChanged = useMemo(() => {
    return !(
      JSON.stringify(currentFilters) === JSON.stringify(currentView?.filters) &&
      globalJoin === currentView?.globalJoin &&
      currentViewType === currentView?.viewType
    )
  }, [currentFilters, currentView, globalJoin])

  const onDeleteView = async () => {
    if (currentView) {
      setDeleting(true)
      await deleteView(currentView.id)
      setDeleting(false)
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  return (
    <StyledTaskHeader>
      <TaskHeaderTitleSection>
        <ToolbarTooltip singleton={source} />
        <TaskHeaderIcon>
          <Icon icon={checkboxLine} />
        </TaskHeaderIcon>
        {currentView ? (
          <TaskViewHeaderWrapper>
            <TaskViewTitle>
              <Icon icon={stackLine} />
              {currentView?.title}
              {isCurrentViewChanged && '*'}
            </TaskViewTitle>
            <TaskViewControls>
              <Button
                onClick={() =>
                  openTaskViewModal({
                    filters: currentFilters,
                    updateViewId: currentView?.id,
                    properties: {
                      viewType: currentViewType,
                      globalJoin,
                      sortOrder,
                      sortType
                    }
                  })
                }
                disabled={currentFilters.length === 0}
                // primary={isCurrentViewChanged && currentFilters.length > 0}
              >
                <Icon icon={edit2Line} />
                Update View
              </Button>
              <IconButton
                title="Clone View"
                onClick={() =>
                  openTaskViewModal({
                    filters: currentView?.filters,
                    cloneViewId: currentView?.id,
                    properties: {
                      globalJoin: currentView?.globalJoin,
                      viewType: currentView?.viewType,
                      sortType: currentView?.sortType,
                      sortOrder: currentView?.sortOrder
                    }
                  })
                }
                disabled={currentFilters.length === 0}
                singleton={target}
                icon={fileCopyLine}
                // transparent={false}
              />
              <LoadingButton
                title="Delete View"
                loading={deleting}
                onClick={() => onDeleteView()}
                singleton={target}
                // transparent={false}
              >
                <Icon icon={trashIcon} />
              </LoadingButton>
              <IconButton
                title="Create New View"
                onClick={() =>
                  openTaskViewModal({
                    filters: currentFilters,
                    cloneViewId: currentView?.id,
                    properties: {
                      viewType: ViewType.Kanban,
                      sortOrder: 'ascending',
                      sortType: 'status',
                      globalJoin: 'all'
                    }
                  })
                }
                disabled={currentFilters.length === 0}
                singleton={target}
                // transparent={false}
                icon={addCircleLine}
              />
            </TaskViewControls>
          </TaskViewHeaderWrapper>
        ) : (
          <>
            <Title>Tasks</Title>
            <Button
              onClick={() =>
                openTaskViewModal({
                  filters: currentFilters,
                  cloneViewId: currentView?.id,
                  properties: {
                    globalJoin,
                    viewType: currentViewType ?? ViewType.Kanban
                  }
                })
              }
              disabled={currentFilters.length === 0}
            >
              <Icon icon={addCircleLine} />
              Create View
            </Button>
          </>
        )}
      </TaskHeaderTitleSection>
      <ShortcutTokens>
        <ShortcutToken>
          Select:
          <Icon icon={dragMove2Fill} />
        </ShortcutToken>
        {cardSelected && (
          <>
            <ShortcutToken>
              Open:
              <DisplayShortcut shortcut="$mod+Enter" />
            </ShortcutToken>
            <ShortcutToken>
              Move:
              <DisplayShortcut shortcut="Shift" />
              <Icon icon={arrowLeftRightLine} />
            </ShortcutToken>
            <ShortcutToken>
              Priority:
              <DisplayShortcut shortcut="$mod+0-3" />
            </ShortcutToken>
          </>
        )}
        {currentFilters.length > 0 && (
          <ShortcutToken>
            Remove Filter:
            <DisplayShortcut shortcut="Shift+F" />
          </ShortcutToken>
        )}
      </ShortcutTokens>
      <Infobox text={TasksHelp} />
    </StyledTaskHeader>
  )
}

export default TaskHeader
