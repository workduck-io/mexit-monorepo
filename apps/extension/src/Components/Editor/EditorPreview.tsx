// different import path!
import React, { forwardRef, useState } from 'react'

import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless'

import { NodeEditorContent, generateTempId, mog, MEXIT_FRONTEND_URL_BASE, getNameFromPath } from '@mexit/core'
import {
  EditorPreviewControls,
  EditorPreviewEditorWrapper,
  EditorPreviewNoteName,
  EditorPreviewWrapper
} from '@mexit/shared'
import { Button } from '@mexit/shared'

import { generateEditorPluginsWithComponents } from '../../Editor/plugins'
// import useLoad from '../../../Hooks/useLoad'
// import { useRouting, ROUTE_PATHS, NavigationType } from '../../../Hooks/useRouting'
// import { useTags } from '../../Hooks/useTags'
import { useLinks } from '../../Hooks/useLinks'
import { useContentStore } from '../../Stores/useContentStore'
import { getElementById } from '../../Utils/cs-utils'
import EditorPreviewRenderer from '../EditorPreviewRenderer'
import components from './Components'

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
  // const { hasTags } = useTags()
  // const { loadNode } = useLoad()
  // const { goTo } = useRouting()

  const ilink = getILinkFromNodeid(nodeid)

  const editorId = `__preview__${nodeid}_${generateTempId()}`

  const onClickNavigate = (e) => {
    e.preventDefault()
    mog('OnClickNavigate', { e })
    // loadNode(nodeid)
    window.open(`${MEXIT_FRONTEND_URL_BASE}/editor/${nodeid}`)
    // goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const plugins = generateEditorPluginsWithComponents(components, { exclude: { dnd: true } })

  if (cc) {
    return (
      <LazyTippy
        interactive
        delay={delay ?? 250}
        interactiveDebounce={100}
        placement={placement ?? 'bottom'}
        visible={preview}
        appendTo={() => getElementById('sputlit-main')}
        render={(attrs) => (
          <EditorPreviewWrapper className="__editor__preview" tabIndex={-1} {...attrs}>
            {(allowClosePreview ||
              // TODO: look into adding useTags later
              // hasTags(nodeid)
              false ||
              ilink?.path) && (
              <EditorPreviewControls
              // hasTags={
              //   hasTags(nodeid)
              // }
              >
                {ilink?.path && (
                  <EditorPreviewNoteName onClick={onClickNavigate}>
                    <Icon icon={ilink?.icon ?? fileList2Line} />
                    {getNameFromPath(ilink.path)}
                  </EditorPreviewNoteName>
                )}
                {/* <TagsRelatedTiny nodeid={nodeid} /> */}
                <Button transparent onClick={() => closePreview && closePreview()}>
                  <Icon icon={closeCircleLine} />
                </Button>
              </EditorPreviewControls>
            )}
            <EditorPreviewEditorWrapper>
              <EditorPreviewRenderer content={cc} editorId={editorId} plugins={plugins} />
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
