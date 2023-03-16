import React, { useMemo } from 'react'

import { Placement } from '@floating-ui/react-dom-interactions'
import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { useTheme } from 'styled-components'

import { useContentStore,useMetadataStore, useSnippetStore  } from '@mexit/core'
import {
  DefaultMIcons,
  EditorPreviewControls,
  EditorPreviewNoteName,
  EditorPreviewWrapper,
  Group,
  MexIcon,
  NestedFloating,
  PreviewActionHeader,
  PrimaryText,
  Tooltip
} from '@mexit/shared'

import { useSnippets } from '../../Hooks/useSnippets'
import { getElementById } from '../../Utils/cs-utils'
import EditorPreviewRenderer from '../EditorPreviewRenderer'

export interface SnippetPreviewProps {
  snippetId?: string
  children: React.ReactElement
  placement?: Placement
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  // editable?: boolean
  label?: string
  onClick?: (e: any) => void
  disableClick?: boolean
  allowClosePreview?: boolean
  icon?: string
  nodeId?: string
  title?: string
  iconTooltip?: string
  handleCopy?: (ev?: any) => void
  setPreview?: (open: boolean) => void
}

const SnippetPreview = ({
  snippetId,
  allowClosePreview,
  children,
  hover,
  label,
  title,
  handleCopy,
  nodeId,
  placement,
  onClick,
  disableClick,
  setPreview,
  icon,
  iconTooltip,
  preview
}: SnippetPreviewProps) => {
  const { getSnippet } = useSnippets()
  const getContent = useContentStore((s) => s.getContent)
  const contentStore = useContentStore((s) => s.contents)
  const snippets = useSnippetStore((store) => store.snippets)

  const snippet: any = useMemo(() => {
    if (snippetId) return getSnippet(snippetId)
    if (nodeId) return getContent(nodeId)
  }, [snippetId, nodeId, snippets, contentStore])

  const noteIcon = useMetadataStore((s) => s.metadata.notes?.[nodeId]?.icon)

  const editorId = `${snippetId ?? nodeId ?? 'Content'}_Preview`

  const onClickNavigate = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (onClick) onClick(e)
  }

  const theme = useTheme()

  if (snippet) {
    return (
      <NestedFloating
        hover={hover}
        disableClick={disableClick}
        root={getElementById('ext-side-nav')}
        label={label}
        scrollLock={false}
        initialFocus={-1}
        placement={placement}
        persist={!allowClosePreview}
        open={preview}
        setOpen={setPreview}
        render={({ close, labelId }) => (
          <EditorPreviewWrapper id={labelId} className="__editor__preview" tabIndex={-1}>
            <EditorPreviewControls>
              <PreviewActionHeader>
                <EditorPreviewNoteName onClick={onClickNavigate}>
                  <MexIcon $noHover icon={noteIcon ?? (snippet?.template ? magicLine : quillPenLine)} />
                  <PrimaryText>{title ?? snippet?.title}</PrimaryText>
                </EditorPreviewNoteName>
                {icon && iconTooltip && (
                  <Tooltip key={labelId} content={iconTooltip}>
                    <MexIcon color={theme.tokens.text.fade} $noHover icon={icon} height="14" width="14" />
                  </Tooltip>
                )}
              </PreviewActionHeader>
              <PreviewActionHeader>
                <Group>
                  {handleCopy && (
                    <MexIcon
                      cursor="pointer"
                      icon={DefaultMIcons.COPY.value}
                      height={20}
                      width={20}
                      onClick={handleCopy}
                    />
                  )}
                  <MexIcon
                    cursor="pointer"
                    icon={DefaultMIcons.CLEAR.value}
                    height={20}
                    width={20}
                    onClick={(ev) => {
                      ev.preventDefault()
                      ev.stopPropagation()
                      close()
                    }}
                  />
                </Group>
              </PreviewActionHeader>
            </EditorPreviewControls>
            <EditorPreviewRenderer content={snippet.content} readOnly={true} editorId={editorId} />
          </EditorPreviewWrapper>
        )}
      >
        {children}
      </NestedFloating>
    )
  } else return children
}

export default SnippetPreview
