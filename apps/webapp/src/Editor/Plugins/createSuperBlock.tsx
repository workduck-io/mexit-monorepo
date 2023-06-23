import { createPluginFactory, TNodeEntry, WithOverride, wrapNodes } from '@udecode/plate'

import { SuperBlocks } from '@mexit/core'

export const SUPER_BLOCK_PLUGIN_KEY = 'plugin-super-block'

const withSuperBlockOverride: WithOverride = (editor, { type, options }) => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]: TNodeEntry) => {
    if (path.length === 1 && !Object.values(SuperBlocks).includes(node.type as unknown as SuperBlocks)) {
      wrapNodes(editor, { type: SuperBlocks.CONTENT, children: node.children as any })

      return true
    }

    normalizeNode([node, path])
  }

  return editor
}

export const createSuperBlockPlugin = createPluginFactory({
  key: SUPER_BLOCK_PLUGIN_KEY,
  withOverrides: withSuperBlockOverride,
  isElement: false,
  isVoid: false
})

// const onNodeSet = <N extends TDescendant>(editor, operation: TOperation<N>, apply: any, noteId: string): void => {
//   const properties = operation.properties as any
//   const newProperties = operation.newProperties as any

//   const isEntityDeleted = EntityElements.includes(properties?.type) && newProperties
//   const isEntityAdded = EntityElements.includes(newProperties?.type) && properties

//   if (isEntityDeleted) {
//     const node = getNode(editor, operation.path as any)
//     deleteTodoEntity(noteId, node)

//     return apply({
//       ...operation,
//       newProperties: {
//         ...newProperties,
//         entityId: undefined
//       }
//     })
//   } else if (isEntityAdded && !properties.entityId) {
//     const todo = updateTodoEntity(noteId)

//     return apply({
//       ...operation,
//       newProperties: {
//         ...newProperties,
//         entityId: todo.entityId
//       }
//     })
//   }

//   return apply(operation)
// }

// const onNodeInsert = <N extends TDescendant>(operation: TOperation<N>, apply: any, noteId: string): void => {
//   const node = operation?.node as any

//   if (node?.type === ELEMENT_TODO_LI) {
//     const todo = updateTodoEntity(noteId, { todoContent: [node], newEntityId: true })

//     return apply({
//       ...operation,
//       node: {
//         ...node,
//         entityId: todo.entityId
//       }
//     })
//   }

//   return apply(operation)
// }

// const onNodeSplit = <N extends TDescendant>(operation: TOperation<N>, apply: any, noteId: string): void => {
//   const node = operation.properties as TNode

//   // only for elements (node with a type)`
//   if (queryNode([node, []], {}) && node?.type === ELEMENT_TODO_LI) {
//     const todo = updateTodoEntity(noteId)

//     return apply({
//       ...operation,
//       properties: {
//         ...node,
//         id: todo.id,
//         children: todo.content[0]?.children,
//         entityId: todo.entityId
//       }
//     })
//   }

//   return apply(operation)
// }

// const onNodeRemove = <N extends TDescendant>(operation: TOperation<N>, apply: any, noteId: string): void => {
//   const node = operation.node as any

//   // only for elements (node with a type)`
//   if (queryNode([node, []], {}) && node?.type === ELEMENT_TODO_LI) {
//     deleteTodoEntity(noteId, node)
//   }

//   return apply(operation)
// }

// // const onNodeTextInsert = <N extends TDescendant>(operation: TOperation<N>, noteId: string): void => {
// //   const node = operation.node as any

// //   // only for elements (node with a type)`
// //   if (queryNode([node, []], {}) && node?.type === ELEMENT_TODO_LI) {
// //     useTodoBufferStore.getState().update(noteId, node?.entityId)
// //   }
// // }

// export const withTodoOverride =
//   (withEntity = true) =>
//   <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
//     if (!withEntity) return editor

//     const { apply } = editor

//     let debouncedUpdate
//     const noteId = getNodeIdFromEditor(editor.id)

//     editor.apply = (operation) => {
//       mog(`Performing ${operation.type.toLocaleUpperCase()}`, { operation })

//       switch (operation.type) {
//         case 'set_node':
//           return onNodeSet(editor, operation, apply, noteId)

//         case 'insert_node':
//           return onNodeInsert(operation, apply, noteId)

//         case 'split_node':
//           return onNodeSplit(operation, apply, noteId)

//         case 'remove_node':
//           return onNodeRemove(operation, apply, noteId)

//         case 'insert_text':
//         case 'remove_text':
//           if (debouncedUpdate) {
//             debouncedUpdate(operation)
//           } else {
//             debouncedUpdate = debounce((operation) => {
//               const node = getParentNode(editor, operation.path)?.[0] as any

//               if (node && node.type === ELEMENT_TODO_LI) {
//                 useTodoBufferStore.getState().updateTodoContent(noteId, node.entityId, [node])
//               }
//             }, 200)
//           }
//       }
//       return apply(operation)
//     }

//     return editor
//   }
