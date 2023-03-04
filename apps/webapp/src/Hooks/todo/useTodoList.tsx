import {
  convertContentToRawText,
  defaultContent,
  Filter,
  GlobalFilterJoin,
  SNIPPET_PREFIX,
  SortOrder,
  SortType,
  TodosType
} from '@mexit/core'

import { sortFunctions, useFilterFunctions } from '../useFilterFunctions'
import { useNodes } from '../useNodes'
import { useSearchExtra } from '../useSearch'

export const useTodoList = () => {
  const { isInArchive } = useNodes()
  const taskFilterFunctions = useFilterFunctions()
  const { getSearchExtra } = useSearchExtra()
  const extra = getSearchExtra()

  const getList = (
    todos: TodosType,
    currentFilters: Filter[],
    globalJoin: GlobalFilterJoin,
    sortOrder: SortOrder,
    sortType: SortType
  ) => {
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
            return sortFunctions[sortType](a, b)
          } else {
            return sortFunctions[sortType](b, a)
          }
        } else return 0
      })
  }

  return { getList }
}
