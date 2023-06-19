import { createPluginFactory, TNodeEntry, WithOverride, wrapNodes } from '@udecode/plate'

import { SuperBlocks } from '@mexit/core'

export const ELEMENT_SUPER_BLOCK = 'super-block'

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
  key: ELEMENT_SUPER_BLOCK,
  withOverrides: withSuperBlockOverride
})
