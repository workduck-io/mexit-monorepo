import create from 'zustand'
import { persist } from 'zustand/middleware'

import {
  NodeEditorContent,
  defaultContent,
  TodoStatus,
  PriorityType,
  TodosType,
  TodoType,
  convertContentToRawText,
  IDBStorage
} from '@mexit/core'

import { useReminderStore } from './useReminderStore'

const createTodo = (nodeid: string, todoId: string, content: NodeEditorContent = defaultContent.content) => ({
  id: todoId,
  nodeid,
  content,
  metadata: {
    status: TodoStatus.todo,
    priority: PriorityType.noPriority
  },
  createdAt: Date.now(),
  updatedAt: Date.now()
})

type TodoStoreType = {
  // * For all nodes
  todos: TodosType
  clearTodos: () => void
  initTodos: (todos: TodosType) => void

  // * Update specific node todos
  setNodeTodos: (nodeid: string, todos: Array<TodoType>) => void
  addTodoInNode: (nodeid: string, todo: TodoType) => void
  getTodoOfNode: (nodeid: string, todoId: string) => TodoType | undefined
  getTodoOfNodeWithoutCreating: (nodeid: string, todoId: string) => TodoType | undefined
  updateTodoOfNode: (nodeid: string, todo: TodoType) => void
  replaceContentOfTodos: (nodeid: string, todosContent: NodeEditorContent) => void
  getAllTodos: () => TodosType

  updatePriorityOfTodo: (nodeid: string, todoId: string, priority: PriorityType) => void
  updateStatusOfTodo: (nodeid: string, todoId: string, status: TodoStatus) => void
}

const useTodoStore = create<TodoStoreType>(
  persist(
    (set, get) => ({
      todos: {},
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
        // mog('getTodoOfNode', { nodeid, todoId, todo })
        if (!todo) {
          const newTodo = createTodo(nodeid, todoId)
          if (!nodeid) return newTodo
          get().addTodoInNode(nodeid, newTodo)

          return newTodo
        }

        return todo
      },

      getAllTodos: () => {
        const allTodos = Object.entries(get().todos).reduce((acc, [nodeid, todos]) => {
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
        // mog('currentTodos', { newTodos, nodeid, todos })
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
          // mog('replaceContent', { nodeid, todosContent, nodeTodos, todo, content })
          return todo ? { ...todo, content: [content] } : createTodo(nodeid, content.id, [content])
        })

        const leftOutTodos = nTodo.filter((todo) => !nodeTodos.find((t) => t.id === todo.id && nodeid === t.nodeid))

        const reminders = useReminderStore.getState().reminders
        const setReminders = useReminderStore.getState().setReminders
        const newReminders = reminders.filter((reminder) => !leftOutTodos.find((todo) => todo.id === reminder.todoid))

        setReminders(newReminders)
        const newtodos = { ...todos, [nodeid]: nodeTodos }
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
    }),
    { name: 'mexit-todo-store', getStorage: () => IDBStorage }
  )
)

export { useTodoStore }
