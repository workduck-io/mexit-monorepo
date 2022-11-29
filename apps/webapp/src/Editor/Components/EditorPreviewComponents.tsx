/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TAG,
  ELEMENT_TASK_VIEW_LINK,
  ELEMENT_TODO_LI
} from '@mexit/core'
import { LinkElement, MediaEmbedElement, TableWrapper } from '@mexit/shared'
import { createPlateUI, withProps } from '@udecode/plate'
import { StyledElement } from '@udecode/plate-styled-components'

import TagWrapper from '../../Components/Editor/TagWrapper'
import Todo from '../../Components/Todo'
import InlineBlock from './InlineBlock'
import { MentionElement } from './Mentions/MentionElement'
import { QuickLinkElement } from './QuickLink/QuickLinkElement'
import TaskViewLink from './TaskViewLink'

export const editorPreviewComponents = createPlateUI({
  [ELEMENT_LINK]: withProps(LinkElement, {
    as: 'a'
  }),
  [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
    styles: {
      root: {
        margin: '0.1rem 0 0'
      }
    }
  }),
  [ELEMENT_TODO_LI]: Todo as any,
  [ELEMENT_TAG]: TagWrapper as any,
  [ELEMENT_ILINK]: QuickLinkElement as any,
  [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any,
  [ELEMENT_TABLE]: TableWrapper,
  [ELEMENT_MENTION]: MentionElement as any,
  [ELEMENT_TASK_VIEW_LINK]: TaskViewLink as any
})

const components = createPlateUI({
  ...editorPreviewComponents,
  [ELEMENT_INLINE_BLOCK]: InlineBlock as any
})

export default components
