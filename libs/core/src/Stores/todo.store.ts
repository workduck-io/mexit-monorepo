import { NodeEditorContent } from '../Types/Editor'
import { StoreIdentifier } from '../Types/Store'
import { PriorityType, TodoStatus, TodosType, TodoType } from '../Types/Todo'
import { getMentionsFromContent, getTagsFromContent } from '../Utils/content'
import { ELEMENT_TODO_LI } from '../Utils/editorElements'
import { defaultContent } from '../Utils/helpers'
import { convertContentToRawText } from '../Utils/parseData'
import { createStore } from '../Utils/storeCreator'

import { useReminderStore } from './reminder.store'

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
const todoStoreConfig = (set, get) => ({
  todos: {} as TodosType,
  initTodos: (todos: TodosType) => {
    if (todos) {
      set({ todos })
    }
  },
  clearTodos: () => set({ todos: {} }),

  addTodoInNode: (nodeId: string, todo: TodoType) => {
    if (!nodeId) {
      return
    }
    const todos = get().todos ?? {}

    const nodeTodos = todos?.[nodeId] ?? []
    set({ todos: { ...todos, [nodeId]: [todo, ...nodeTodos] } })
  },
  getTodoOfNodeWithoutCreating: (nodeId: string, todoId: string): TodoType | undefined => {
    const todo = get().todos?.[nodeId]?.find((todo) => todo.id === todoId && nodeId === todo.nodeid)
    return todo
  },
  getTodoOfNode: (nodeId: string, todoId: string): TodoType => {
    const todo = get().todos?.[nodeId]?.find((todo) => todo.id === todoId && nodeId === todo.nodeid)
    // mog('getTodoOfNode', { nodeid, todoId, todo, todos: get().todos })
    if (!todo) {
      const newTodo = createTodo(nodeId, todoId)
      if (!nodeId) return newTodo
      get().addTodoInNode(nodeId, newTodo)

      return newTodo
    }

    return todo
  },

  getAllTodos: (): TodosType => {
    const allTodos = Object.entries(get().todos).reduce((acc, [nodeid, todos]: [string, TodoType[]]) => {
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

  setNodeTodos: (nodeId: string, todos: Array<TodoType>) => {
    // mog('setNodeTodos', { nodeid, todos })
    if (!nodeId) return
    const currentTodos = get().todos ?? {}
    const newTodos = { ...currentTodos, [nodeId]: todos }
    set({ todos: newTodos })
  },
  updateTodoOfNode: (nodeId: string, todo: TodoType) => {
    // mog('updateNodeTodos', { nodeid, todo })
    if (!nodeId) return
    const currentTodos = get().todos ?? {}

    const todos = currentTodos?.[nodeId] ?? []
    const newTodos = todos.map((t) =>
      t.id === todo.id && todo.nodeid === nodeId ? { ...todo, updatedAt: Date.now() } : t
    )
    // mog('TODO UPDATE', { newTodos, nodeid, todos })
    set({ todos: { ...currentTodos, [nodeId]: newTodos } })
  },
  appendTodos: (noteId: string, todosContent: NodeEditorContent) => {
    const todos = get().todos ?? {}
    const existingTodos = todos[noteId] ?? []

    const noteTodos = todosContent.map((block) => {
      const tags = getTagsFromContent([block])
      const mentions = getMentionsFromContent([block])
      return createTodo(noteId, block.id, [block], mentions, tags)
    })

    set({ todos: { ...todos, [noteId]: [...noteTodos, ...existingTodos] } })
  },

  replaceContentOfTodos: (nodeId: string, todosContent: NodeEditorContent) => {
    if (!nodeId) return
    const todos = get().todos ?? {}

    if (todosContent.length === 0) {
      if (!todos[nodeId]) return

      delete todos[nodeId]
      set({ todos })

      return
    }

    const nTodo = todos[nodeId] ?? []
    const nodeTodos = todosContent.map((content) => {
      const todo = nTodo.find((todo) => todo.id === content.id && nodeId === todo.nodeid)
      const tags = getTagsFromContent([content])
      const mentions = getMentionsFromContent([content])
      // mog('replaceContent', { nodeid, tags, mentions, todosContent, nodeTodos, todo, content })

      // Currently nothing as todo id, it is same as block id for now
      return createTodo(nodeId, content.id, [content], mentions, tags)
    })

    const leftOutTodos = nTodo.filter((todo) => !nodeTodos.find((t) => t.id === todo.id && nodeId === t.nodeid))

    const reminders = useReminderStore.getState().reminders
    const setReminders = useReminderStore.getState().setReminders
    const newReminders = reminders.filter((reminder) => !leftOutTodos.find((todo) => todo.id === reminder.todoid))

    setReminders(newReminders)
    const newtodos = { ...todos, [nodeId]: nodeTodos }
    // mog('NEW TODO', { newtodos })
    set({ todos: newtodos })
  },
  updatePriorityOfTodo: (nodeId: string, todoId: string, priority: PriorityType) => {
    // mog('updatePro', { nodeid, todoId, priority })
    if (!nodeId) return
    const todo = get().getTodoOfNodeWithoutCreating(nodeId, todoId)
    if (!todo) return

    const newTodo = { ...todo, metadata: { ...todo.metadata, priority } }
    get().updateTodoOfNode(nodeId, newTodo)
  },
  updateStatusOfTodo: (nodeId: string, todoId: string, status: TodoStatus) => {
    // mog('updateSta', { nodeid, todoId, status })
    if (!nodeId) return
    const todo = get().getTodoOfNodeWithoutCreating(nodeId, todoId)
    if (!todo) return

    const newTodo = { ...todo, metadata: { ...todo.metadata, status } }
    get().updateTodoOfNode(nodeId, newTodo)
  },
  moveTodo: (todoId: string, fromId: string, toId: string) => {
    const todos = get().todos
    const todo = get().getTodoOfNodeWithoutCreating(fromId, todoId)

    set({
      todos: {
        ...todos,
        [fromId]: todos[fromId].filter((i) => i.id !== todoId),
        [toId]: [{ ...todo, nodeid: toId }, ...todos[toId]]
      }
    })
  }
})

export const useTodoStore = createStore(todoStoreConfig, StoreIdentifier.TODO, true)
