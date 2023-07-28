import { PlateEditor, queryNode, TNode, Value } from '@udecode/plate'

export const SOURCE_PLUGIN = 'BLOCK_MODIFIER_PLUGIN'

const withSourceOverride = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
  const { apply } = editor

  editor.apply = (operation) => {
    if (operation.type === 'split_node') {
      const node = operation.properties as TNode

      // only for elements (node with a type) having 'blockMeta' data`
      if (queryNode([node, []], {}) && node['blockMeta']) {
        const { blockMeta, ...restProperties } = node

        return apply({
          ...operation,
          properties: {
            ...restProperties
          }
        })
      }
    }

    return apply(operation)
  }

  return editor
}

// export const createBlockModifierPlugin = (): PlatePlugin => ({
//   key: SOURCE_PLUGIN,
//   withOverrides: withSourceOverride,
//   inject: {
//     aboveComponent: () => SourceInfo
//   }
// })
