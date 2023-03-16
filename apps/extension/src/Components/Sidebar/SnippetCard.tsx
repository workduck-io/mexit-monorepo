import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import fileCopyLine from '@iconify-icons/ri/file-copy-line'
import { useTheme } from 'styled-components'

import { tinykeys } from '@workduck-io/tinykeys'

import { API_BASE_URLS, Snippet, useDescriptionStore } from '@mexit/core'
import {
  GenericFlex,
  MexIcon,
  PrimaryText,
  RelativeTime,
  SnippetCardFooter,
  SnippetCardWrapper,
  SnippetContentPreview
} from '@mexit/shared'

import SnippetPreview from '../Editor/SnippetPreview'

import { NodeCardHeader } from './NodeCard'

interface SnippetCardProps {
  snippet: Snippet
  keyStr: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean

  /**
   * Replace the default onclick action on node link
   */
  onClick?: (ev: any) => void
}

const SnippetCard = ({ snippet, preview = true, icon, keyStr, onClick }: SnippetCardProps) => {
  const theme = useTheme()

  const [visible, setVisible] = React.useState(false)
  const descriptions = useDescriptionStore((store) => store.descriptions)

  const lastUsed = undefined // getLastUsed(snippet.id)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        closePreview()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (!snippet) return <></>

  const onTitleClick = () => {
    window.open(`${API_BASE_URLS.frontend}/snippets/node/${snippet.id}`, '_blank')
  }

  const closePreview = () => {
    setVisible(false)
  }

  return (
    // TODO: Not able to scroll these previews using mouse
    <ErrorBoundary fallbackRender={() => <></>}>
      <SnippetPreview
        key={keyStr}
        hover
        preview={visible}
        disableClick
        onClick={onTitleClick}
        handleCopy={onClick}
        setPreview={setVisible}
        allowClosePreview
        snippetId={snippet.id}
        placement="left"
      >
        <SnippetCardWrapper>
          <NodeCardHeader>
            <GenericFlex onClick={onTitleClick}>
              <MexIcon
                color={theme.tokens.colors.primary.default}
                icon={snippet?.template ? magicLine : quillPenLine}
              />
              <PrimaryText>{snippet.title}</PrimaryText>
            </GenericFlex>
            <MexIcon onClick={onClick} icon={fileCopyLine} height={16} width={16} />
          </NodeCardHeader>

          <SnippetContentPreview>{descriptions[snippet?.id]?.rawText}</SnippetContentPreview>
          <SnippetCardFooter>
            {lastUsed && (
              <RelativeTime
                tippy
                dateNum={lastUsed}
                prefix="Last used"
                refreshMs={1000 * 30}
                tippyProps={{ placement: 'left', theme: 'mex-bright' }}
              />
            )}
          </SnippetCardFooter>
        </SnippetCardWrapper>
      </SnippetPreview>
    </ErrorBoundary>
  )
}

export default SnippetCard
