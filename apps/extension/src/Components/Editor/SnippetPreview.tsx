import React, { useMemo } from 'react'

import { Placement } from '@floating-ui/react-dom-interactions'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { useTheme } from 'styled-components'

import { Button, MexIcon } from '@workduck-io/mex-components'

import {
  EditorPreviewControls,
  EditorPreviewNoteName,
  EditorPreviewWrapper,
  NestedFloating,
  PreviewActionHeader,
  Tooltip
} from '@mexit/shared'

import { useSnippets } from '../../Hooks/useSnippets'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { getElementById } from '../../Utils/cs-utils'
import EditorPreviewRenderer from '../EditorPreviewRenderer'

export interface SnippetPreviewProps {
  snippetId: string
  children: React.ReactElement
  placement?: Placement
  delay?: number
  preview?: boolean
  previewRef?: any
  hover?: boolean
  // editable?: boolean
  label?: string
  disableClick?: boolean
  allowClosePreview?: boolean
  icon?: string
  iconTooltip?: string
  setPreview?: (open: boolean) => void
}

const SnippetPreview = ({
  snippetId,
  allowClosePreview,
  children,
  hover,
  label,
  placement,
  disableClick,
  // editable = true,
  setPreview,
  icon,
  iconTooltip,
  preview
}: SnippetPreviewProps) => {
  // const { getILinkFromNodeid } = useLinks()

  // const { hasTags } = useTags()
  // const { loadNode, getNoteContent } = useLoad()
  // const { goTo } = useRouting()
  // const { getNamespace } = useNamespaces()
  const { getSnippet } = useSnippets()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const snippets = useSnippetStore((store) => store.snippets)

  const snippet = useMemo(() => {
    const s = getSnippet(snippetId)
    return s
  }, [snippetId, snippets])

  const editorId = `${snippetId}_Preview`

  const onClickNavigate = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    loadSnippet(snippet?.id)
    // goTo(ROUTE_PATHS.node, NavigationType.push, snippetId)
    // goTo(ROUTE_PATHS.snippet, NavigationType.push, snippet?.id, { title: snippet?.title })
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
        placement={placement}
        persist={!allowClosePreview}
        open={preview}
        setOpen={setPreview}
        render={({ close, labelId }) => (
          <EditorPreviewWrapper id={labelId} className="__editor__preview" tabIndex={-1}>
            <EditorPreviewControls
            // hasTags={hasTags(snippetId)}
            >
              <PreviewActionHeader>
                <EditorPreviewNoteName onClick={onClickNavigate}>
                  <Icon icon={snippet.template ? magicLine : quillPenLine} />
                  {snippet.title}
                </EditorPreviewNoteName>
                {icon && iconTooltip && (
                  <Tooltip key={labelId} content={iconTooltip}>
                    <MexIcon color={theme.tokens.text.fade} noHover icon={icon} height="14" width="14" />
                  </Tooltip>
                )}
              </PreviewActionHeader>
              <PreviewActionHeader>
                {/* <TagsRelatedTiny nodeid={snippetId} /> */}
                <Button
                  onClick={(ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                    close()
                  }}
                >
                  <Icon icon={closeCircleLine} />
                </Button>
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
