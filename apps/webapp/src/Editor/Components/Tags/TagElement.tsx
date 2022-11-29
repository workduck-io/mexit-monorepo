import { STag, STagRoot, TagElementProps } from '@mexit/shared'
import { moveSelection, useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { useFocused, useSelected } from 'slate-react'

import { useHotkeys } from '../../../Hooks/useHotkeys'
import { useOnMouseClick } from '../../../Hooks/useOnMouseClick'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'

/**
 * TagElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
const TagElement = ({ attributes, children, element }: TagElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    openTag(element.value)
  })

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        moveSelection(editor)
      }
    },
    [selected, focused]
  )

  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        // mog('delete', { selected, focused, sel: editor.selection })
        moveSelection(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  const openTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <STagRoot {...attributes} data-slate-value={element.value} contentEditable={false}>
      <STag {...onClickProps} selected={selected}>
        #{element.value}
      </STag>
      {children}
    </STagRoot>
  )
}

export default TagElement
