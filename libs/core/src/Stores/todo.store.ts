import { NodeEditorContent } from '../Types/Editor';
import { StoreIdentifier } from '../Types/Store';
import { PriorityType, TodoStatus, TodosType, TodoType } from '../Types/Todo';
import { getMentionsFromContent, getTagsFromContent } from '../Utils/content';
import { ELEMENT_TODO_LI } from '../Utils/editorElements';
import { defaultContent } from '../Utils/helpers';
import { convertContentToRawText } from '../Utils/parseData';
import { createStore } from '../Utils/storeCreator'

import { useReminderStore } from './reminder.store';

const getTodoMetadata = (content: NodeEditorContent) => {
    if (!content) return
  
    const block = content[0]
  
    if (block && block.type === ELEMENT_TODO_LI) {
      const { priority, status, metadata, ...rest } = block
  
      return {
        priority,
        status,
        createdAt: metadata?.createdAt,
        updatedAt: metadata?.updatedAt
      }
    }
  }
  

export const createTodo = (
  nodeid: string,
  todoId: string,
  content: NodeEditorContent = defaultContent.content,
  mentions: string[] = [],
  tags: string[] = []
) => {
  const metaData = getTodoMetadata(content)
  // mog('CONTENT OF CREATE', { content })
  return {
    id: todoId,
    nodeid,
    content,
    metadata: {
      status: metaData?.status ?? TodoStatus.todo,
      priority: metaData?.priority ?? PriorityType.noPriority
    },
    mentions,
    tags,
    createdAt: metaData?.createdAt ?? Date.now(),
    updatedAt: metaData?.updatedAt ?? Date.now()
  }
}
const TODOS : TodosType = {}
const todoStoreConfig = (set, get) => ({
  todos: TODOS,
  initTodos: (todos) => {
    if (todos) {
      set({ todos })
    }
  },
  clearTodos: () => set({ todos: {} }),

  addTodoInNode: (nodeid, todo) => {
    if (!nodeid) {
      return
    }
    const todos = get().todos ?? {}

    const nodeTodos = todos?.[nodeid] ?? []
    set({ todos: { ...todos, [nodeid]: [todo, ...nodeTodos] } })
  },
  getTodoOfNodeWithoutCreating: (nodeid, todoId) => {
    const todo = get().todos?.[nodeid]?.find((todo) => todo.id === todoId && nodeid === todo.nodeid)
    return todo
  },

  getTodoOfNode: (nodeid, todoId) => {
    const todo = get().todos?.[nodeid]?.find((todo) => todo.id === todoId && nodeid === todo.nodeid)
    // mog('getTodoOfNode', { nodeid, todoId, todo, todos: get().todos })
    if (!todo) {
      const newTodo = createTodo(nodeid, todoId)
      if (!nodeid) return newTodo
      get().addTodoInNode(nodeid, newTodo)

      return newTodo
    }

    return todo
  },

  getAllTodos: () => {
    const allTodos = Object.entries(get().todos).reduce((acc, [nodeid, todos] : [string, TodoType[]]) => {
      const newTodos = todos.filter((todo) => {
        // TODO: Find a faster way to check for empty content
        const text = convertContentToRawText(todo.content).trim()
        // mog('empty todo check', { text, nodeid, todo })
        if (text === '') {
          return false
        }
        if (todo.content === defaultContent.content) return false
        return true
      })

      return { ...acc, [nodeid]: newTodos }
    }, {})
    return allTodos
  },

  setNodeTodos: (nodeid, todos) => {
    // mog('setNodeTodos', { nodeid, todos })
    if (!nodeid) return
    const currentTodos = get().todos ?? {}
    const newTodos = { ...currentTodos, [nodeid]: todos }
    set({ todos: newTodos })
  },
  updateTodoOfNode: (nodeid, todo) => {
    // mog('updateNodeTodos', { nodeid, todo })
    if (!nodeid) return
    const currentTodos = get().todos ?? {}

    const todos = currentTodos?.[nodeid] ?? []
    const newTodos = todos.map((t) =>
      t.id === todo.id && todo.nodeid === nodeid ? { ...todo, updatedAt: Date.now() } : t
    )
    // mog('TODO UPDATE', { newTodos, nodeid, todos })
    set({ todos: { ...currentTodos, [nodeid]: newTodos } })
  },
  replaceContentOfTodos: (nodeid, todosContent) => {
    // mog('replaceContentOfTodos', { nodeid, todosContent })
    if (!nodeid) return
    const todos = get().todos ?? {}

    if (todosContent.length === 0) {
      if (!todos[nodeid]) return

      delete todos[nodeid]
      set({ todos })

      return
    }

    const nTodo = todos[nodeid] ?? []
    const nodeTodos = todosContent.map((content) => {
      const todo = nTodo.find((todo) => todo.id === content.id && nodeid === todo.nodeid)
      const tags = getTagsFromContent([content])
      const mentions = getMentionsFromContent([content])
      // mog('replaceContent', { nodeid, tags, mentions, todosContent, nodeTodos, todo, content })

      // Currently nothing as todo id, it is same as block id for now
      return createTodo(nodeid, content.id, [content], mentions, tags)
    })

    const leftOutTodos = nTodo.filter((todo) => !nodeTodos.find((t) => t.id === todo.id && nodeid === t.nodeid))

    const reminders = useReminderStore.getState().reminders
    const setReminders = useReminderStore.getState().setReminders
    const newReminders = reminders.filter((reminder) => !leftOutTodos.find((todo) => todo.id === reminder.todoid))

    setReminders(newReminders)
    const newtodos = { ...todos, [nodeid]: nodeTodos }
    // mog('NEW TODO', { newtodos })
    set({ todos: newtodos })
  },
  updatePriorityOfTodo: (nodeid, todoId, priority) => {
    // mog('updatePro', { nodeid, todoId, priority })
    if (!nodeid) return
    const todo = get().getTodoOfNodeWithoutCreating(nodeid, todoId)
    if (!todo) return

    const newTodo = { ...todo, metadata: { ...todo.metadata, priority } }
    get().updateTodoOfNode(nodeid, newTodo)
  },
  updateStatusOfTodo: (nodeid, todoId, status) => {
    // mog('updateSta', { nodeid, todoId, status })
    if (!nodeid) return
    const todo = get().getTodoOfNodeWithoutCreating(nodeid, todoId)
    if (!todo) return

    const newTodo = { ...todo, metadata: { ...todo.metadata, status } }
    get().updateTodoOfNode(nodeid, newTodo)
  }
})

export const useTodoStore = createStore(todoStoreConfig, StoreIdentifier.TODO, true)
