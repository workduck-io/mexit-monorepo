import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import trashIcon from '@iconify/icons-codicon/trash'
import dragMove2Fill from '@iconify/icons-ri/drag-move-2-fill'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'

import { DisplayShortcut, IconButton, LoadingButton, ToolbarTooltip } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import {
  PrimaryText,
  ShortcutToken,
  ShortcutTokens,
  TaskHeader as StyledTaskHeader,
  TaskHeaderTitleSection,
  TaskViewControls,
  TaskViewHeaderWrapper,
  TaskViewTitle
} from '@mexit/shared'

import { useViewFilters } from '../Hooks/todo/useTodoFilters'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useViews } from '../Hooks/useViews'
import { useViewStore } from '../Stores/useViewStore'

import ViewBreadcrumbs from './Views/ViewBreadcrumbs'
import { useTaskViewModalStore } from './TaskViewModal'

interface ViewHeaderProps {
  cardSelected?: boolean // * To show actions related to selected Item
}

const ViewChangeStatus = ({ viewId }) => {
  const views = useViewStore((store) => store.views)

  const { viewType, sortOrder, globalJoin, sortType, entities, currentFilters, groupBy } = useViewFilters()
  const { getView, updateView } = useViews()

  const isCurrentViewChanged = useMemo(() => {
    const currentView = getView(viewId)
    return !(
      JSON.stringify(currentFilters) === JSON.stringify(currentView?.filters) &&
      viewType === currentView?.viewType &&
      groupBy === currentView?.groupBy &&
      sortType === currentView?.sortType &&
      sortOrder === currentView?.sortOrder &&
      entities === currentView?.entities
    )
  }, [currentFilters, viewType, entities, groupBy, sortType, sortOrder, views, viewId])

  const onSaveView = useCallback(
    async (viewId: string) => {
      const oldview = getView(viewId)

      const newView = {
        ...oldview,
        filters: currentFilters,
        viewType,
        globalJoin,
        groupBy,
        entities,
        sortOrder,
        sortType
      }

      try {
        await updateView(newView)
        toast('View Saved')
      } catch (err) {
        console.error('Unable to save view', err)
        toast('Unable to save view')
      }
    },
    [currentFilters, viewType, groupBy, sortType, sortOrder, entities]
  )

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyS': (e) => {
        e.stopPropagation()
        e.preventDefault()

        if (isCurrentViewChanged) {
          onSaveView(viewId)
        }
      }
    })

    return () => unsubscribe()
  }, [viewId, onSaveView, isCurrentViewChanged])

  return <PrimaryText>{isCurrentViewChanged && '*'}</PrimaryText>
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
      type: 'save-as',
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
    <>
      <ViewBreadcrumbs path={view?.path} />
      <StyledTaskHeader>
        <TaskHeaderTitleSection>
          <ToolbarTooltip singleton={source} />
          {view && (
            <TaskViewHeaderWrapper>
              <TaskViewTitle>
                <Icon icon={stackLine} />
                <span>{view?.title}</span>
                {view?.id && !isDefault && <ViewChangeStatus viewId={view?.id} />}
              </TaskViewTitle>
              <TaskViewControls>
                {!isDefault && (
                  <IconButton title="Update View" onClick={handleUpdateView} singleton={target} icon={edit2Line} />
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
            Select Card:
            <Icon icon={dragMove2Fill} />
          </ShortcutToken>

          {currentFilters.length > 0 && (
            <ShortcutToken>
              Remove Filter:
              <DisplayShortcut shortcut="Shift+F" />
            </ShortcutToken>
          )}
        </ShortcutTokens>
      </StyledTaskHeader>
    </>
  )
}

export default ViewHeader
