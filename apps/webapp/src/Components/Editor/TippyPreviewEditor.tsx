import React, { forwardRef, useState } from 'react'
import Tippy from '@tippyjs/react/headless'
import { transparentize } from 'polished'
import styled from 'styled-components'

import PreviewEditor from './PreviewEditor'
import { CardShadow } from '../../Style/Helpers'
import { useContentStore } from '@workduck-io/mex-editor'

export const TippyPreviewEditorWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])} !important;

  backdrop-filter: blur(10px);

  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.fade};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  min-width: 400px;
`

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

export interface TippyPreviewEditorProps {
  nodeid: string
  children: React.ReactElement
  placement?: string
  delay?: number
  isPreview?: boolean
  preview?: boolean
  previewRef?: any
}

const TippyPreviewEditor = ({
  nodeid,
  placement,
  isPreview,
  preview,
  children,
  previewRef,
  delay
}: TippyPreviewEditorProps) => {
  const getContent = useContentStore((store) => store.getContent)
  const content = getContent(nodeid)
  const cc = content && content.content

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
          <TippyPreviewEditorWrapper className="__editor__preview" tabIndex={-1} {...attrs}>
            {cc && <PreviewEditor content={cc} editorId={`__preview__${nodeid}`} />}
          </TippyPreviewEditorWrapper>
        )}
      >
        {children}
      </LazyTippy>
    )
  } else return children
}

export default TippyPreviewEditor
