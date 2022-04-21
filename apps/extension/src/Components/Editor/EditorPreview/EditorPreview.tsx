import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless' // different import path!
import React, { forwardRef, useState } from 'react'
import { getNameFromPath } from '../../../components/mex/Sidebar/treeUtils'
import { TagsRelatedTiny } from '../../../components/mex/Tags/TagsRelated'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { useLinks } from '../../../hooks/useLinks'
import { useTags } from '../../../hooks/useTags'
import { useContentStore } from '../../../store/useContentStore'
import { Button } from '../../../style/Buttons'
import { NodeEditorContent } from '../../../types/Types'
import { mog } from '../../../utils/lib/helper'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper
} from './EditorPreview.styles'
import useLoad from '../../../hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'

export interface EditorPreviewProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  preview?: boolean
  previewRef?: any
  content?: NodeEditorContent
  allowClosePreview?: boolean
  closePreview?: () => void
}

export const LazyTippy = forwardRef(function LT(props: any, ref) {
  const [mounted, setMounted] = useState(false)

  const lazyPlugin = {
    fn: () => ({
      onMount: () => {
        setMounted(true)
      },
      onHidden: () => {
        setMounted(false)
      }
    })
  }

  const computedProps = { ...props }

  computedProps.plugins = [lazyPlugin, ...(props.plugins || [])]

  if (props.render) {
    computedProps.render = (...args) => (mounted ? props.render(...args) : '')
  } else {
    computedProps.content = mounted ? props.content : ''
  }

  return <Tippy {...computedProps} ref={ref} />
})

const EditorPreview = ({
  nodeid,
  placement,
  allowClosePreview,
  closePreview,
  preview,
  children,
  delay,
  content,
  ...props
}: EditorPreviewProps) => {
  const { getILinkFromNodeid } = useLinks()
  const getContent = useContentStore((store) => store.getContent)
  const nodeContent = getContent(nodeid)
  const cc = content ?? (nodeContent && nodeContent.content)
  const { hasTags } = useTags()
  const { loadNode } = useLoad()
  const { goTo } = useRouting()

  const ilink = getILinkFromNodeid(nodeid)

  const editorId = `__preview__${nodeid}_${generateTempId()}`

  const onClickNavigate = (e) => {
    e.preventDefault()
    mog('OnClickNavigate', { e })
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  if (cc) {
    return (
      <LazyTippy
        interactive
        delay={delay ?? 250}
        interactiveDebounce={100}
        placement={placement ?? 'bottom'}
        visible={preview}
        appendTo={() => document.body}
        render={(attrs) => (
          <EditorPreviewWrapper className="__editor__preview" tabIndex={-1} {...attrs}>
            {(allowClosePreview || hasTags(nodeid) || ilink?.path) && (
              <EditorPreviewControls hasTags={hasTags(nodeid)}>
                {ilink?.path && (
                  <EditorPreviewNoteName onClick={onClickNavigate}>
                    <Icon icon={ilink?.icon ?? fileList2Line} />
                    {getNameFromPath(ilink.path)}
                  </EditorPreviewNoteName>
                )}
                <TagsRelatedTiny nodeid={nodeid} />
                {allowClosePreview && (
                  <Button transparent onClick={() => closePreview && closePreview()}>
                    <Icon icon={closeCircleLine} />
                  </Button>
                )}
              </EditorPreviewControls>
            )}
            <EditorPreviewEditorWrapper>
              <EditorPreviewRenderer content={cc} editorId={editorId} />
            </EditorPreviewEditorWrapper>
          </EditorPreviewWrapper>
        )}
      >
        {children}
      </LazyTippy>
    )
  } else return children
}

export default EditorPreview
