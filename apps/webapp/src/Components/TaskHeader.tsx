import React, { useMemo } from 'react'

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

import { Button, IconButton, DisplayShortcut, ToolbarTooltip } from '@workduck-io/mex-components'
import Infobox from '@workduck-io/mex-components'

import { SearchFilter } from '@mexit/core'
import {
  ShortcutMid,
  ShortcutToken,
  ShortcutTokens,
  TaskHeader as StyledTaskHeader,
  TaskHeaderIcon,
  TaskHeaderTitleSection,
  TaskViewControls,
  TaskViewHeaderWrapper,
  TaskViewTitle,
  Title
} from '@mexit/shared'

import { TasksHelp } from '../Data/defaultText'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useViewStore, View } from '../Hooks/useTaskViews'
import { useTaskViewModalStore } from './TaskViewModal'

interface TaskHeaderProps {
  currentView?: View<any>
  currentFilters: SearchFilter<any>[]
  cardSelected: boolean
}

const TaskHeader = ({ currentView, currentFilters, cardSelected }: TaskHeaderProps) => {
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)
  const removeView = useViewStore((store) => store.removeView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)

  const { goTo } = useRouting()

  const [source, target] = useSingleton()

  const isCurrentFiltersUnchanged = useMemo(() => {
    return JSON.stringify(currentFilters) === JSON.stringify(currentView?.filters)
  }, [currentFilters, currentView])

  const onRemoveView = () => {
    if (currentView) {
      removeView(currentView.id)
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
          <>
            <TaskViewHeaderWrapper>
              <TaskViewTitle>
                <Icon icon={stackLine} />
                {currentView?.title}
                {!isCurrentFiltersUnchanged && '*'}
              </TaskViewTitle>
              <TaskViewControls>
                <Button
                  onClick={() =>
                    openTaskViewModal({
                      filters: currentFilters,
                      updateViewId: currentView?.id
                    })
                  }
                  disabled={currentFilters.length === 0}
                  primary={!isCurrentFiltersUnchanged && currentFilters.length > 0}
                >
                  <Icon icon={edit2Line} />
                  Update View
                </Button>
                <IconButton
                  title="Clone View"
                  onClick={() => openTaskViewModal({ filters: currentView?.filters, cloneViewId: currentView?.id })}
                  disabled={currentFilters.length === 0}
                  singleton={target}
                  icon={fileCopyLine}
                  transparent={false}
                />
                <IconButton
                  title="Remove View"
                  onClick={() => onRemoveView()}
                  singleton={target}
                  icon={trashIcon}
                  transparent={false}
                />
                <IconButton
                  title="Create New View"
                  onClick={() => openTaskViewModal({ filters: currentFilters, cloneViewId: currentView?.id })}
                  disabled={currentFilters.length === 0}
                  singleton={target}
                  icon={addCircleLine}
                  transparent={false}
                />
              </TaskViewControls>
            </TaskViewHeaderWrapper>
          </>
        ) : (
          <>
            <Title>Tasks</Title>
            <Button
              onClick={() => openTaskViewModal({ filters: currentFilters, cloneViewId: currentView?.id })}
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
              Navigate:
              <DisplayShortcut shortcut="$mod+Enter" />
            </ShortcutToken>
            <ShortcutToken>
              Move:
              <DisplayShortcut shortcut="Shift" />
              <ShortcutMid>+</ShortcutMid>
              <Icon icon={arrowLeftRightLine} />
            </ShortcutToken>
            <ShortcutToken>
              Change Priority:
              <DisplayShortcut shortcut="$mod+0-3" />
            </ShortcutToken>
          </>
        )}
        <ShortcutToken>
          {cardSelected || currentFilters.length > 0 ? 'Clear Filters:' : 'Navigate to Editor:'}
          <DisplayShortcut shortcut="Esc" />
        </ShortcutToken>
      </ShortcutTokens>
      {/*<Button onClick={onClearClick}>
   <Icon icon={trashIcon} height={24} />
   Clear Todos
   </Button> */}
      <Infobox text={TasksHelp} />
    </StyledTaskHeader>
  )
}

export default TaskHeader
