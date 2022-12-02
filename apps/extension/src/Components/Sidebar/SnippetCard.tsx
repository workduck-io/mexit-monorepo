import React, { useEffect } from 'react'

import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import fileCopyLine from '@iconify-icons/ri/file-copy-line'

import { tinykeys } from '@workduck-io/tinykeys'

import { Snippet } from '@mexit/core'
import {
  GenericFlex,
  IconButton,
  MexIcon,
  RelativeTime,
  SnippetCardFooter,
  SnippetCardWrapper,
  SnippetContentPreview
} from '@mexit/shared'

import { useDescriptionStore } from '../../Stores/useDescriptionStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
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
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const SnippetCard = ({ snippet, preview = true, icon, keyStr, onClick }: SnippetCardProps) => {
  const [visible, setVisible] = React.useState(false)
  const descriptions = useDescriptionStore((store) => store.descriptions)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  // TODO: make and sync a last used snippet store
  // const { getLastUsed } = useLastUsedSnippets()
  // const { push } = useNavigation()

  const onClickProps = (ev: any) => {
    ev.preventDefault()
    ev.stopPropagation()

    // TODO: commenting this our for a while, need to have better click and hover interaction
    // if (onClick) {
    //   onClick(ev)
    // }
    // else {
    //   window.open(`${MEXIT_FRONTEND_URL_BASE}/snippets/node/${snippet.id}`)
    // }

    if (!visible) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  // const snippetTags = useMemo(() => {
  //   if(!snippet?.content) return
  //   return getTagsFromContent(snippet?.content).map((tag) => ({ value: tag }))
  // }, [snippet])

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
            <MexIcon icon={snippet.template ? magicLine : quillPenLine} />
            {snippet.title}
          </GenericFlex>
          <GenericFlex>
            <IconButton onClick={onClick} icon={fileCopyLine} size="16px" title="Copied to Clipboard" />
          </GenericFlex>
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
