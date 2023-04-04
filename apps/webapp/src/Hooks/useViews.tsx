import { Entities } from '@workduck-io/mex-search'

import { Filter, getAllEntities, useDataStore, View, ViewType } from '@mexit/core'

import { useViewStore } from '../Stores/useViewStore'

import { useViewAPI } from './API/useViewsAPI'

export const useViews = () => {
  const addViewStore = useViewStore((store) => store.addView)
  const updateViewStore = useViewStore((store) => store.updateView)
  const removeViewStore = useViewStore((store) => store.removeView)
  const { saveView, deleteView: deleteViewApi } = useViewAPI()

  const getDefaultNote = (): Filter => {
    const note = useDataStore.getState().ilinks.find((ilink) => ilink.path === 'Daily Tasks')

    if (note) {
      return {
        multiple: false,
        id: 'FILTER_NOTE',
        join: 'all',
        type: 'note',
        values: [
          {
            value: note.nodeid,
            id: note.nodeid,
            label: note.path
          }
        ]
      }
    }
  }

  const getParentViewFilters = (path: string) => {
    const entities = getAllEntities(path)

    const filters = entities.reduce((acc, entityId) => {
      const view = getView(entityId)

      if (view?.filters) {
        acc.push({ id: entityId, label: view.title, filters: view.filters })
      }

      return acc
    }, [] as Array<{ id: string; label: string; filters: Array<Filter> }>)

    return filters
  }

  const getView = (id: string): View | undefined => {
    switch (id) {
      case 'tasks':
        // eslint-disable-next-line no-case-declarations
        const filters = getDefaultNote()
        return {
          id: 'tasks',
          filters: filters ? [filters] : [],
          title: 'Tasks',
          description: 'The Tasks view is a powerful tool for managing and tracking tasks.',
          viewType: ViewType.List,
          entities: [Entities.TASK],
          groupBy: 'data.status',
          globalJoin: 'all',
          sortOrder: 'ascending'
        }
      case 'reminders':
        return {
          id: 'reminders',
          filters: [],
          title: 'Reminders',
          description: 'The Reminders View is helpful tool for keeping track of tasks, events, and deadlines.',
          viewType: ViewType.List,
          entities: [Entities.REMINDER],
          globalJoin: 'all',
          sortOrder: 'ascending'
        }
      default:
        // eslint-disable-next-line no-case-declarations
        const view = useViewStore.getState().views?.find((v) => v.id === id)
        return view
    }
  }

  const getViewNamedPath = (id: string, parentPath: string) => {
    const entities = getAllEntities(parentPath)

    const parent = entities.reduce((parent, entityId) => {
      const view = getView(entityId)

      if (view) {
        if (parent.length === 0) parent = `${view.title}`
        else parent.concat(`.${view.title}`)
      }

      return parent
    }, '')

    return parent ? `${parent}.${getView(id)?.title}` : getView(id)?.title
  }

  const addView = async (view: View, onSuccess: (id: string) => void) => {
    await saveView(view)
    onSuccess(view.id)
    addViewStore(view)
  }

  const updateView = async (view: View) => {
    await saveView(view)
    updateViewStore(view)
  }

  const deleteView = async (viewid: string) => {
    await deleteViewApi(viewid)
    removeViewStore(viewid)
  }

  return { getView, getViewNamedPath, addView, updateView, deleteView, getParentViewFilters }
}
