import React from 'react'

import { Icon } from '@iconify/react'

import { convertContentToRawText } from '@mexit/core'
import {
  SnippetCardFooter,
  SnippetCardHeader,
  SnippetCardWrapper,
  SnippetContentPreview,
  TagsLabel
} from '@mexit/shared'

import { getTitleFromPath } from '../../Hooks/useLinks'
import { useNodes } from '../../Hooks/useNodes'
import { useContentStore } from '../../Stores/useContentStore'

export const NodeCard = ({ nodeId, onClick }: { nodeId: string; onClick: (nodeId: string) => void }) => {
  const { getNode } = useNodes()
  const getContent = useContentStore((store) => store.getContent)

  const node = getNode(nodeId)
  const contents = getContent(nodeId)
  return (
    <SnippetCardWrapper>
      <SnippetCardHeader onClick={() => onClick(nodeId)}>
        <Icon icon="gg:file-document" />
        {getTitleFromPath(node?.path)}
      </SnippetCardHeader>

      {/* TODO: saving raw content for nodes as well would be grand */}
      <SnippetContentPreview>{contents && convertContentToRawText(contents.content, ' ')}</SnippetContentPreview>

      <SnippetCardFooter>{/* <TagsLabel tags={}/> */}</SnippetCardFooter>
    </SnippetCardWrapper>
  )
}
