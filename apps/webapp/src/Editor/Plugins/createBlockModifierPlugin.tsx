import { PlateEditor, PlatePlugin, queryNode, TNode, Value } from '@udecode/plate'
import { BlockInfo } from '../../Components/Editor/BlockInfo/BlockInfo.index'

export const BLOCK_MODIFIER_PLUGIN = 'BLOCK_MODIFIER_PLUGIN'

const withSourceOverride = <V extends Value = Value, E extends PlateEditor<V> = PlateEditor<V>>(editor: E) => {
  const { apply } = editor

  editor.apply = (operation) => {
    // Preserve the source info when splitting
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

/** Shows share link, comments and reactions attached to the block */
export const createBlockModifierPlugin = (): PlatePlugin => ({
  key: BLOCK_MODIFIER_PLUGIN,
  withOverrides: withSourceOverride,
  isInline: false,
  inject: {
    aboveComponent: () => BlockInfo
  }
})
