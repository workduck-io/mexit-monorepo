import React, { useState } from 'react'

import { moveSelection, useEditorRef } from '@udecode/plate'
import { useFocused, useReadOnly, useSelected } from 'slate-react'

import { API_BASE_URLS, mog } from '@mexit/core'
import { ILinkElementProps, SILink, SILinkRoot } from '@mexit/shared'

import EditorPreview from '../../../../Components/Editor/EditorPreview'
import { useLinks } from '../../../../Hooks/useLinks'
import { getBlock } from '../../../../Utils/parseData'
import { useHotkeys } from '../../../hooks/useHotKeys'

export const QuickLinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const [preview, setPreview] = useState(false)
  // const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  // mog('We reached here', { selected, focused })

  // const nodeid = getNodeidFromPath(element.value)
  const readOnly = useReadOnly()
  const path = getPathFromNodeid(element.value)
  // const { archived } = useArchive()
  // const { goTo } = useRouting()

  const onClickProps = () => {
    // Show preview on click, if preview is shown, navigate to link
    if (!preview) {
      setPreview(true)
    } else {
      mog('pushing', { id: element.value })
      // push(element.value)
      // goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
      window.open(`${API_BASE_URLS.frontend}/editor/${element.value}`)
    }
  }

  // useEffect(() => {
  //   // If the preview is shown and the element losses focus --> Editor focus is moved
  //   // Hide the preview
  //   if (preview && !selected) setPreview(false)
  // }, [selected])

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        moveSelection(editor)
      }
    },
    [element]
  )

  useHotkeys(
    'enter',
    () => {
      // mog('Enter the dragon', { selected, preview, focused, esl: editor.selection })
      // Show preview on Enter, if preview is shown, navigate to link
      if (selected && focused && editor.selection) {
        if (!preview) setPreview(true)
      }
      // Once preview is shown the link looses focus
      if (preview) {
        mog('working', { element })
        // push(element.value)
        // goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
        window.open(`${API_BASE_URLS.frontend}/editor/${element.value}`)
      }
    },
    [selected, preview]
  )
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        moveSelection(editor, { reverse: true })
      }
    },
    [selected, focused]
  )
  // const isArchived = archived(element.value)
  const block = element.blockId ? getBlock(element.value, element.blockId) : undefined
  const content = block ? [block] : undefined
  // const archivedNode = isArchived ? getArchiveNode(element.value) : undefined

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={element.value}
      contentEditable={false}
    >
      <EditorPreview
        placement="auto"
        allowClosePreview={readOnly}
        preview={preview}
        nodeid={element.value}
        content={content}
        closePreview={() => setPreview(false)}
      >
        <SILink $selected={selected} onClick={onClickProps}>
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          <span className="ILink_decoration ILink_decoration_value">
            {' '}
            {!content ? path : `${path} : ${element.blockValue}`}{' '}
          </span>
          <span className="ILink_decoration ILink_decoration_right">]]</span>
        </SILink>
      </EditorPreview>
      {children}
    </SILinkRoot>
  )
}
