import { useMemo, useState } from 'react'

import trashIcon from '@iconify/icons-codicon/trash'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import arrowLeftRightLine from '@iconify/icons-ri/arrow-left-right-line'
import dragMove2Fill from '@iconify/icons-ri/drag-move-2-fill'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'
import { useTheme } from 'styled-components'

import {
  Button,
  DisplayShortcut,
  IconButton,
  Infobox,
  LoadingButton,
  ToolbarTooltip
} from '@workduck-io/mex-components'

import { ViewType } from '@mexit/core'
import {
  DefaultMIcons,
  IconDisplay,
  ShortcutToken,
  ShortcutTokens,
  TaskHeader as StyledTaskHeader,
  TaskHeaderIcon,
  TaskHeaderTitleSection,
  TasksHelp,
  TaskViewControls,
  TaskViewHeaderWrapper,
  TaskViewTitle,
  Title
} from '@mexit/shared'

import { useViewFilters } from '../Hooks/todo/useTodoFilters'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useViews } from '../Hooks/useViews'
import { useViewStore } from '../Stores/useViewStore'

import { useTaskViewModalStore } from './TaskViewModal'

interface ViewHeaderProps {
  cardSelected: boolean
}

const ViewHeader = ({ cardSelected }: ViewHeaderProps) => {
  const [deleting, setDeleting] = useState(false)
  /**
   * sortOrder, sortType, viewType, currentFilters, globalJoin
   */

  const view = useViewStore((store) => store.currentView)
  const onChangeView = useViewStore((store) => store.setCurrentView)
  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)

  const theme = useTheme()
  const { goTo } = useRouting()
  const { deleteView } = useViews()
  const [source, target] = useSingleton()
  const { viewType, sortOrder, globalJoin, sortType, currentFilters } = useViewFilters()

  const isCurrentViewChanged = useMemo(() => {
    return !(JSON.stringify(currentFilters) === JSON.stringify(view?.filters) && viewType === view?.viewType)
  }, [currentFilters, viewType, view])

  const onDeleteView = async () => {
    if (view) {
      try {
        setDeleting(true)
        await deleteView(view.id)
        setDeleting(false)
        onChangeView(undefined)

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
        {!view && (
          <TaskHeaderIcon>
            <IconDisplay color={theme.tokens.colors.primary.default} size={28} icon={DefaultMIcons.TASK} />
          </TaskHeaderIcon>
        )}
        {view ? (
          <TaskViewHeaderWrapper>
            <TaskViewTitle>
              <Icon icon={stackLine} />
              {view?.title}
              {isCurrentViewChanged && '*'}
            </TaskViewTitle>
            <TaskViewControls>
              <Button
                onClick={() =>
                  openTaskViewModal({
                    filters: currentFilters,
                    updateViewId: view?.id,
                    properties: {
                      viewType: viewType,
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
                    filters: view?.filters,
                    cloneViewId: view?.id,
                    properties: {
                      globalJoin: view?.globalJoin,
                      viewType: view?.viewType,
                      sortType: view?.sortType,
                      sortOrder: view?.sortOrder
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
                    cloneViewId: view?.id,
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
                  cloneViewId: view?.id,
                  properties: {
                    globalJoin,
                    viewType: viewType ?? ViewType.Kanban
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

export default ViewHeader
