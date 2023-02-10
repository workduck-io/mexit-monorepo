import React, { useEffect } from 'react'

import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import fileCopyLine from '@iconify-icons/ri/file-copy-line'
import { useTheme } from 'styled-components'

import { tinykeys } from '@workduck-io/tinykeys'

import { Snippet } from '@mexit/core'
import {
  GenericFlex,
  MexIcon,
  PrimaryText,
  RelativeTime,
  SnippetCardFooter,
  SnippetCardWrapper,
  SnippetContentPreview
} from '@mexit/shared'

import { useDescriptionStore } from '../../Stores/useDescriptionStore'
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
  const [visible, setVisible] = React.useState(false)
  const descriptions = useDescriptionStore((store) => store.descriptions)

  const theme = useTheme()

  const onClickProps = (ev: any) => {
    ev.preventDefault()
    ev.stopPropagation()

    if (!visible) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

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

  const closePreview = () => {
    setVisible(false)
  }

  return (
    // TODO: Not able to scroll these previews using mouse
    <SnippetPreview
      key={keyStr}
      hover
      preview={visible}
      setPreview={setVisible}
      allowClosePreview
      snippetId={snippet.id}
      placement="left"
    >
      <SnippetCardWrapper>
        <NodeCardHeader>
          <GenericFlex>
            <MexIcon color={theme.tokens.colors.primary.default} icon={snippet?.template ? magicLine : quillPenLine} />
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
  )
}

export default SnippetCard
