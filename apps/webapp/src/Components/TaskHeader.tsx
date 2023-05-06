import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import trashIcon from '@iconify/icons-codicon/trash'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'

import { IconButton, LoadingButton, ToolbarTooltip } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { MIcon } from '@mexit/core'
import {
  DefaultMIcons,
  GenericFlex,
  IconDisplay,
  Menu,
  MenuItem,
  PrimaryText,
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

import { useOnNewItem } from './FleetContainer/useOnNewItem'
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

const CreateNewMenu = () => {
  const { getQuickNewItems } = useOnNewItem()

  const items = useMemo(() => {
    const sections = getQuickNewItems(true)
    return [sections.task, sections.content].map((item) => {
      return {
        ...item,
        label: item.name,
        id: item.id.toString()
      }
    })
  }, [])

  return (
    <Menu
      key="wd-mexit-space-selector"
      noHover
      border
      values={
        <GenericFlex>
          <IconDisplay icon={DefaultMIcons.ADD} size={24} />
          Add New
        </GenericFlex>
      }
    >
      {items.map((op) => {
        return <MenuItem key={op.id} icon={op.icon as MIcon} onClick={op.onSelect} label={op.label} />
      })}
    </Menu>
  )
}

const ViewHeader = ({ cardSelected = false }: ViewHeaderProps) => {
  const [deleting, setDeleting] = useState(false)

  const { deleteView, getView } = useViews()
  const currentView = useViewStore((store) => store.currentView)
  const views = useViewStore((store) => store.views)

  const view = useMemo(() => {
    return getView(currentView?.id)
  }, [currentView, views])

  const openTaskViewModal = useTaskViewModalStore((store) => store.openModal)

  const isDefault = ['tasks', 'personal'].includes(view?.id)

  const { goTo } = useRouting()

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
        <CreateNewMenu />
      </StyledTaskHeader>
    </>
  )
}

export default ViewHeader
