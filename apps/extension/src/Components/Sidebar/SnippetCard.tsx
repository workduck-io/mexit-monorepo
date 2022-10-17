import React, { useEffect, useMemo } from 'react'

import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'

import { tinykeys } from '@workduck-io/tinykeys'

import { Snippet, getTagsFromContent, convertContentToRawText } from '@mexit/core'
import {
  SnippetCardWrapper,
  SnippetCardHeader,
  SnippetContentPreview,
  SnippetCardFooter,
  RelativeTime
} from '@mexit/shared'

import { useDescriptionStore } from '../../Stores/useDescriptionStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import SnippetPreview from '../Editor/SnippetPreview'

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

  const onClickProps = (ev) => {
    // Show preview on click, if preview is shown, navigate to link
    ev.preventDefault()
    // ev.stopPropagation()

    if (onClick) {
      onClick(ev)
    } else {
      loadSnippet(snippet.id)
      // TODO: open the snippet in a new tab
      // goTo(ROUTE_PATHS.node, NavigationType.push, snippet.id)
    }

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

  // mog('SnippetCard', { snippet, lastUsed })

  return (
    // TODO: Not able to scroll these previews using mouse
    <SnippetPreview
      key={keyStr}
      preview={visible}
      setPreview={setVisible}
      hover
      allowClosePreview
      snippetId={snippet.id}
      placement="left"
    >
      <SnippetCardWrapper>
        <SnippetCardHeader onClick={(e) => onClickProps(e)}>
          <Icon icon={snippet.template ? magicLine : quillPenLine} />
          {snippet.title}
        </SnippetCardHeader>

        <SnippetContentPreview>{descriptions[snippet?.id]?.rawText}</SnippetContentPreview>
        <SnippetCardFooter>
          {/* <TagsLabel tags={snippetTags} /> */}
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
