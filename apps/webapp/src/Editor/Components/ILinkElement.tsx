import { useReadOnly, useFocused, useSelected } from 'slate-react'
import archivedIcon from '@iconify/icons-ri/archive-line'
import { Icon } from '@iconify/react'
import { useEditorRef } from '@udecode/plate'
import * as React from 'react'
import { useState } from 'react'
import { Transforms } from 'slate'
import styled from 'styled-components'
import { ILinkElementProps, useContentStore, useLinks, useNodes } from '@workduck-io/mex-editor'
import useArchive from '../../Hooks/useArchive'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useOnMouseClick } from '../../Hooks/useOnMouseClick'
import { useHotkeys } from '../../Hooks/useHotkeys'
import { getBlocks, mog } from '@mexit/core'
import { SILink, SILinkRoot } from '../../Style/ILinkElement.styles'
import EditorPreview from './EditorPreview/EditorPreview'

/**
 * ILinkElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */

const StyledIcon = styled(Icon)`
  margin-right: 4px;
`

const getBlock = (nodeid: string, blockId: string) => {
  const nodeContent = useContentStore.getState().getContent(nodeid)

  if (nodeContent?.content) {
    const blocksMap = getBlocks(nodeContent.content)
    if (blocksMap) {
      const blocks = Object.values(blocksMap).map((bd) => bd.block)
      if (!blocks) return undefined

      return blocks.find((b) => {
        return b?.id === blockId
      })
    }
  }

  return undefined
}

export const ILinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const [preview, setPreview] = useState(false)
  const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  const { getArchiveNode } = useNodes()
  // mog('We reached here', { selected, focused })

  // const nodeid = getNodeidFromPath(element.value)
  const readOnly = useReadOnly()
  const path = getPathFromNodeid(element.value)
  const { archived } = useArchive()
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    // Show preview on click, if preview is shown, navigate to link
    if (!preview) {
      setPreview(true)
    } else {
      push(element.value)
      goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
    }
  })

  // useEffect(() => {
  //   // If the preview is shown and the element losses focus --> Editor focus is moved
  //   // Hide the preview
  //   if (preview && !selected) setPreview(false)
  // }, [selected])

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
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
        push(element.value)
        goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
      }
    },
    [selected, preview]
  )
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )
  const isArchived = archived(element.value)
  const block = element.blockId ? getBlock(element.value, element.blockId) : undefined
  const content = block ? [block] : undefined
  const archivedNode = isArchived ? getArchiveNode(element.value) : undefined

  console.log({ isArchived, path, element })

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={element.value}
      contentEditable={false}
    >
      {isArchived ? (
        <SILink selected={selected} archived={true}>
          <StyledIcon icon={archivedIcon} color="#df7777" />
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          <span className="ILink_decoration ILink_decoration_value"> {archivedNode?.path}</span>
          <span className="ILink_decoration ILink_decoration_right">]]</span>
        </SILink>
      ) : (
        <EditorPreview
          placement="auto"
          allowClosePreview={readOnly}
          preview={preview}
          nodeid={element.value}
          content={content}
          closePreview={() => setPreview(false)}
        >
          <SILink selected={selected} {...onClickProps}>
            <span className="ILink_decoration ILink_decoration_left">[[</span>
            <span className="ILink_decoration ILink_decoration_value">
              {' '}
              {!content ? path : `${path} : ${element.blockValue}`}{' '}
            </span>
            <span className="ILink_decoration ILink_decoration_right">]]</span>
          </SILink>
        </EditorPreview>
      )}
      {children}
    </SILinkRoot>
  )
}
