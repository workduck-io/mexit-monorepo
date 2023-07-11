import {
  createPluginFactory,
  getNode,
  getParentNode,
  PlateEditor,
  queryNode,
  TDescendant,
  TNode,
  TNodeEntry,
  TOperation,
  Value,
  WithOverride,
  wrapNodes
} from '@udecode/plate'
import { debounce } from 'lodash'

import { createSuperBlockContent, mog, SuperBlocks } from '@mexit/core'

import { getNodeIdFromEditor } from '../Utils/helper'

export const SUPER_BLOCK_PLUGIN_KEY = 'plugin-super-block'

const onNodeSet = <N extends TDescendant>(editor, operation: TOperation<N>, apply: any, noteId: string): void => {
  const properties = operation.properties as any
  const newProperties = operation.newProperties as any

  const isEntityDeleted = SuperBlocks[properties?.type] && newProperties
  const isEntityAdded = SuperBlocks[newProperties?.type] && properties

  if (isEntityDeleted) {
    const node = getNode(editor, operation.path as any)
    // deleteEntityAPI(noteId, node)

    return apply({
      ...operation,
      newProperties: {
        ...newProperties,
        entityId: undefined
      }
    })
  } else if (isEntityAdded && !properties.entityId) {
    // const entity = onEntityChange(noteId)

    return apply({
      ...operation,
      newProperties: {
        ...newProperties
        // entityId: entityId.entityId
      }
    })
  }

  return apply(operation)
}

const onNodeInsert = <N extends TDescendant>(operation: TOperation<N>, apply: any, noteId: string): void => {
  const node = operation?.node as any

  if (Object.values(SuperBlocks).includes(node?.type)) {
    const content = [node]
    // const entity = createEntity(noteId, content)

    return apply({
      ...operation,
      node: {
        ...node
        // entityId: entity.entityId
      }
    })
  }

  return apply(operation)
}

const onNodeSplit = <N extends TDescendant>(operation: TOperation<N>, apply: any, noteId: string): void => {
  const node = operation.properties as TNode

  // only for elements (node with a type)`
  if (queryNode([node, []], {}) && Object.values(SuperBlocks).includes(node?.type)) {
    // const entity = updateEntity(noteId, [node])

    return apply({
      ...operation,
      properties: {
        ...node
        // id: block.id,
        // children: [node],
        // entityId: entity.entityId
      }
    })
  }

  return apply(operation)
}

const onNodeRemove = <N extends TDescendant>(operation: TOperation<N>, apply: any, noteId: string): void => {
  const node = operation.node as any

  // only for elements (node with a type)`
  if (queryNode([node, []], {}) && Object.values(SuperBlocks).includes(node?.type)) {
    // removeEntity(noteId, node)
  }

  return apply(operation)
}

// const onNodeTextInsert = <N extends TDescendant>(operation: TOperation<N>, noteId: string): void => {
//   const node = operation.node as any

//   // only for elements (node with a type)`
//   if (queryNode([node, []], {}) && node?.type === ELEMENT_TODO_LI) {
//     useBufferStore.getState().update(noteId, node?.entityId)
//   }
// }

export const withOverride =
  (withEntity = true) =>
  <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
    if (!withEntity) return editor

    const { apply } = editor

    let debouncedUpdate
    const noteId = getNodeIdFromEditor(editor.id)

    editor.apply = (operation) => {
      mog(`Performing ${operation.type.toLocaleUpperCase()}`, { operation })

      switch (operation.type) {
        case 'set_node':
          return onNodeSet(editor, operation, apply, noteId)

        case 'insert_node':
          return onNodeInsert(operation, apply, noteId)

        case 'split_node':
          return onNodeSplit(operation, apply, noteId)

        case 'remove_node':
          return onNodeRemove(operation, apply, noteId)

        case 'insert_text':
        case 'remove_text':
          if (debouncedUpdate) {
            debouncedUpdate(operation)
          } else {
            debouncedUpdate = debounce((operation) => {
              const node = getParentNode(editor, operation.path)?.[0] as any

              if (node && Object.values(SuperBlocks).includes(node?.type)) {
                // Update the buffer store on content change
                // useBufferStore.getState().updateContent(noteId, node.entityId, [node])
              }
            }, 200)
          }
      }
      return apply(operation)
    }

    return editor
  }

const withSuperBlockOverride: WithOverride = (editor, { type, options }) => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]: TNodeEntry) => {
    if (path.length === 1 && !Object.values(SuperBlocks).includes(node.type as unknown as SuperBlocks)) {
      wrapNodes(editor, createSuperBlockContent(SuperBlocks.CONTENT, node.children as any) as any)

      return
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
