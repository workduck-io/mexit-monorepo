import { convertContentToRawText, defaultContent, SNIPPET_PREFIX, TodosType } from '@mexit/core'

import { taskSortFunctions, useTaskFilterFunctions } from '../useFilterFunctions'
import { useNodes } from '../useNodes'
import { useSearchExtra } from '../useSearch'

import { useTodoFilterStore } from './useTodoFilters'

export const useTodoList = () => {
  const { isInArchive } = useNodes()
  const taskFilterFunctions = useTaskFilterFunctions()
  const { getSearchExtra } = useSearchExtra()
  const extra = getSearchExtra()

  const globalJoin = useTodoFilterStore((state) => state.globalJoin)
  const sortOrder = useTodoFilterStore((state) => state.sortOrder)
  const sortType = useTodoFilterStore((state) => state.sortType)

  const getList = (todos: TodosType) => {
    const currentFilters = useTodoFilterStore.getState().currentFilters
    return Object.entries(todos)
      .map(([nodeid, todos]) => {
        if (nodeid.startsWith(SNIPPET_PREFIX)) return
        if (isInArchive(nodeid)) return
        return todos
          .filter((todo) =>
            currentFilters.length > 0
              ? globalJoin === 'all'
                ? currentFilters.every((filter) => taskFilterFunctions[filter.type](todo, filter))
                : currentFilters.some((filter) => taskFilterFunctions[filter.type](todo, filter))
              : true
          )
          .filter((todo) => {
            // TODO: Find a faster way to check for empty content // May not need to convert content to raw text
            const text = convertContentToRawText(todo.content, ' ', { extra }).trim()
            // mog('empty todo check', { text, nodeid, todo })
            if (text === '') {
              return false
            }
            if (todo.content === defaultContent.content) return false
            return true
          })
      })
      .flat()
      .filter((todo) => todo !== undefined)
      .map((todo) => ({
        id: `TASK_LIST_${todo.id}_${todo.nodeid}`,
        todoid: todo.id,
        nodeid: todo.nodeid,
        status: todo.metadata?.status,
        priority: todo.metadata?.priority
      }))
      .sort((a, b) => {
        if (sortOrder && sortType) {
          if (sortOrder === 'ascending') {
            return taskSortFunctions[sortType](a, b)
          } else {
            return taskSortFunctions[sortType](b, a)
          }
        } else return 0
      })
  }

  return { getList }
}
