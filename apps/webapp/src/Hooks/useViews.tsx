import { Entities } from '@workduck-io/mex-search'

import { Filter, useDataStore, View, ViewType } from '@mexit/core'

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

  const addView = async (view: View) => {
    const resp = await saveView(view)
    // mog('After Saving that view', { resp })
    addViewStore(view)
  }

  const updateView = async (view: View) => {
    const resp = await saveView(view)
    // mog('After update via saving that view', { resp })
    updateViewStore(view)
  }

  const deleteView = async (viewid: string) => {
    const resp = await deleteViewApi(viewid)
    // mog('After deleting that view', { resp })
    removeViewStore(viewid)
  }

  return { getView, addView, updateView, deleteView }
}
