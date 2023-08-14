import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import stackLine from '@iconify/icons-ri/stack-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'
import { useTheme } from 'styled-components'

// import { S3FileDeleteClient } from '@workduck-io/dwindle'
import { ToolbarTooltip } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { getMenuItem, MIcon, useAuthStore, useShareModalStore } from '@mexit/core'
import {
  DefaultMIcons,
  GenericFlex,
  Group,
  IconDisplay,
  InsertMenu,
  Menu,
  MenuButton,
  MenuItem,
  PrimaryText,
  TaskHeader as StyledTaskHeader,
  TaskHeaderTitleSection,
  TaskViewHeaderWrapper,
  TaskViewTitle,
  Tooltip
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
          Add
        </GenericFlex>
      }
    >
      {items.map((op) => {
        return <MenuItem key={op.id} icon={op.icon as MIcon} onClick={op.onSelect} label={op.label} />
      })}
    </Menu>
  )
}

const PublishMenu = ({ id, isPublic }) => {
  const removeViewSnapshotFromCache = useViewStore((store) => store.removeViewSnapshot)
  const updateShareModalData = useShareModalStore((store) => store.updateData)

  const { isDefaultView } = useViews()

  const handleViewUnpublish = () => {
    const workspace = useAuthStore.getState().getWorkspaceId()
    const viewSnapshotKey = `${workspace}/${id}`

    // S3FileDeleteClient({ fileName: viewSnapshotKey, public: true }).then((res) => {
    //   removeViewSnapshotFromCache(viewSnapshotKey)
    // })
  }

  const handlePublish = async () => {
    if (!id) return

    if (isPublic)
      updateShareModalData({
        id,
        share: true
      })
  }

  const options = useMemo(() => {
    if (!isPublic) return null
    return [getMenuItem('Unpublish', () => handleViewUnpublish(), DefaultMIcons.CLEAR, false)]
  }, [isPublic])

  if (isDefaultView(id)) return

  return <MenuButton defaultValue={isPublic ? 'Re-publish' : 'Publish'} onClick={handlePublish} items={options} />
}

const ViewHeader = ({ cardSelected = false }: ViewHeaderProps) => {
  const [deleting, setDeleting] = useState(false)
  const theme = useTheme()

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

  const viewOptions = useMemo(() => {
    return [
      getMenuItem('Edit', () => handleUpdateView(), isDefault, DefaultMIcons.EDIT),
      getMenuItem('Clone', () => handleCloneView(), currentFilters.length === 0, DefaultMIcons.COPY),
      getMenuItem('Save As', () => handleSaveAsView(), currentFilters.length === 0, DefaultMIcons.SAVE),
      getMenuItem('Delete', () => onDeleteView(), isDefault || currentFilters.length === 0, DefaultMIcons.DELETE)
    ]
  }, [isDefault, currentFilters])

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
                {view?.public && (
                  <Tooltip content="Public">
                    <IconDisplay opacity={0.6} color={theme.tokens.colors.fade} size={20} icon={DefaultMIcons.PUBLIC} />
                  </Tooltip>
                )}
                <InsertMenu
                  key={`${isDefault}-${currentFilters.length === 0}`}
                  allowSearch={false}
                  items={viewOptions}
                  isMenu
                  icon={DefaultMIcons.MENU}
                />
              </TaskViewTitle>
            </TaskViewHeaderWrapper>
          )}
        </TaskHeaderTitleSection>

        <Group>
          <PublishMenu id={view?.id} isPublic={view?.public} />
          <CreateNewMenu />
        </Group>
      </StyledTaskHeader>
    </>
  )
}

export default ViewHeader
