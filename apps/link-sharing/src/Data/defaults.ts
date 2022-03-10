import { NodeContent } from '@mexit/shared'

export const ELEMENT_PARAGRAPH = 'p'

export const WORKSPACE_NAME = 'WORKSPACE_MEX'

export const DEFAULT_CONTENT: NodeContent = {
  type: 'init',
  content: [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}
