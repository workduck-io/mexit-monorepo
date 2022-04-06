import { useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'

import { useHotkeys } from '../../Hooks/useHotKeys'
import { useOnMouseClick } from '../../Hooks/useOnMouseClick'
import { STag, STagRoot } from '../../Styles/Tag'

/**
 * TagElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const TagElement = ({ attributes, children, element }) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()

  const onClickProps = useOnMouseClick(() => {
    openTag(element.value)
  })

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
      }
    },
    [selected, focused]
  )
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        // mog('delete', { selected, focused, sel: editor.selection })
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  const openTag = (tag: string) => {
    // Open External Link
    // goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
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
