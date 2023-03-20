import { useMemo, useState } from 'react'

import trashIcon from '@iconify/icons-codicon/trash'
import arrowLeftRightLine from '@iconify/icons-ri/arrow-left-right-line'
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

import {
  ShortcutToken,
  ShortcutTokens,
  TaskHeader as StyledTaskHeader,
  TaskHeaderTitleSection,
  TasksHelp,
  TaskViewControls,
  TaskViewHeaderWrapper,
  TaskViewTitle
} from '@mexit/shared'

import { useViewFilters } from '../Hooks/todo/useTodoFilters'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useViews } from '../Hooks/useViews'
import { useViewStore } from '../Stores/useViewStore'

import { useTaskViewModalStore } from './TaskViewModal'

interface ViewHeaderProps {
  cardSelected?: boolean // * To show actions related to selected Item
}

const ViewHeader = ({ cardSelected = false }: ViewHeaderProps) => {
  const [deleting, setDeleting] = useState(false)

  const view = useViewStore((store) => store.currentView)
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)

  const isDefault = ['tasks', 'reminders'].includes(view?.id)

  const { goTo } = useRouting()
  const { deleteView } = useViews()
  const [source, target] = useSingleton()
  const { viewType, sortOrder, globalJoin, sortType, entities, currentFilters, groupBy } = useViewFilters()

  const isCurrentViewChanged = useMemo(() => {
    return !(
      JSON.stringify(currentFilters) === JSON.stringify(view?.filters) &&
      viewType === view?.viewType &&
      groupBy === view?.groupBy &&
      sortType === view?.sortType &&
      sortOrder === view?.sortOrder &&
      entities === view?.entities
    )
  }, [currentFilters, viewType, groupBy, sortType, sortOrder])

  const handleUpdateView = () => {
    openTaskViewModal({
      filters: currentFilters,
      updateViewId: view?.id,
      properties: {
        viewType,
        globalJoin,
        groupBy,
        entities,
        sortOrder,
        sortType
      }
    })
  }

  const handleSaveAsView = () => {
    openTaskViewModal({
      cloneViewId: view?.id,
      filters: currentFilters,
      properties: {
        viewType,
        globalJoin,
        groupBy,
        entities,
        sortOrder,
        sortType
      }
    })
  }

  const handleCloneView = () => {
    const { id, filters, ...properties } = view

    openTaskViewModal({
      cloneViewId: view?.id,
      filters,
      properties
    })
  }

  const onDeleteView = async () => {
    if (view) {
      try {
        setDeleting(true)
        await deleteView(view.id)
        setDeleting(false)

        goTo(ROUTE_PATHS.tasks, NavigationType.replace)
      } catch (error) {
        setDeleting(false)
        console.error('Unable To Delete View', error)
      }
    }
  }

  return (
    <StyledTaskHeader>
      <TaskHeaderTitleSection>
        <ToolbarTooltip singleton={source} />
        {view && (
          <TaskViewHeaderWrapper>
            <TaskViewTitle>
              <Icon icon={stackLine} />
              {view?.title}
              {isCurrentViewChanged && !isDefault && '*'}
            </TaskViewTitle>
            <TaskViewControls>
              {!isDefault && (
                <Button onClick={handleUpdateView} disabled={currentFilters.length === 0}>
                  <Icon icon={edit2Line} />
                  Update View
                </Button>
              )}
              <IconButton
                title="Clone View"
                onClick={handleCloneView}
                disabled={currentFilters.length === 0}
                singleton={target}
                icon={fileCopyLine}
              />
              <IconButton
                title="Save as"
                onClick={handleSaveAsView}
                disabled={currentFilters.length === 0}
                singleton={target}
                icon="fluent:save-copy-24-regular"
              />
              {!isDefault && (
                <LoadingButton title="Delete View" loading={deleting} onClick={onDeleteView} singleton={target}>
                  <Icon icon={trashIcon} />
                </LoadingButton>
              )}
            </TaskViewControls>
          </TaskViewHeaderWrapper>
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

export default ViewHeader
