import { createPluginFactory } from '@udecode/plate'

import { withRemoveEmptyNodes } from './withRemoveEmptyNodes'

export interface RemoveEmptyNodesPlugin {
  types?: string | string[]
}

export const createRemoveEmptyNodesPlugin = createPluginFactory<RemoveEmptyNodesPlugin>({
  key: 'removeEmptyNodes',
  withOverrides: withRemoveEmptyNodes
})
