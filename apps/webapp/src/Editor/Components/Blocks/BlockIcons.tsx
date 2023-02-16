import globalLine from '@iconify/icons-ri/global-line'
import headingIcon from '@iconify/icons-ri/heading'
import listOrdered from '@iconify/icons-ri/list-ordered'
import listUnordered from '@iconify/icons-ri/list-unordered'
import table from '@iconify/icons-ri/table-line'
import taskLine from '@iconify/icons-ri/task-line'
import text from '@iconify/icons-ri/text'
import { IconifyIcon } from '@iconify/react'
import {
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_TABLE,
  ELEMENT_TODO_LI,
  ELEMENT_UL
} from '@udecode/plate'

import { Entities } from '@workduck-io/mex-search/src/utils'

export const BlockIcons: Record<string, IconifyIcon> = {
  [ELEMENT_TODO_LI]: taskLine,
  [ELEMENT_H1]: headingIcon,
  [ELEMENT_H2]: headingIcon,
  [ELEMENT_H3]: headingIcon,
  [ELEMENT_H4]: headingIcon,
  [ELEMENT_H5]: headingIcon,
  [ELEMENT_H6]: headingIcon,
  [ELEMENT_MEDIA_EMBED]: globalLine,
  [ELEMENT_UL]: listUnordered,
  [ELEMENT_OL]: listOrdered,
  [ELEMENT_DEFAULT]: text,
  [ELEMENT_TABLE]: table
}

export const SearchBlockIcons: Partial<Record<Entities, IconifyIcon>> = {
  [Entities.CONTENT_BLOCK]: text,
  [Entities.TASK]: taskLine
}
