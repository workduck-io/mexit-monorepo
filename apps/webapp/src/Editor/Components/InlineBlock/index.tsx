import React, { useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import { useSelected } from 'slate-react'
import styled from 'styled-components'

import { NodeType } from '@mexit/core'
import { RootElement, SharedNodeIcon } from '@mexit/shared'

import useArchive from '../../../Hooks/useArchive'
import { useLinks } from '../../../Hooks/useLinks'
import { useNodes } from '../../../Hooks/useNodes'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useContentStore } from '../../../Stores/useContentStore'
import { getBlock } from '../../../Utils/parseData'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'
import {
  Chip,
  FlexBetween,
  InlineBlockHeading,
  InlineBlockText,
  InlineFlex,
  StyledInlineBlock,
  StyledInlineBlockPreview
} from '../../Styles/InlineBlock'

const StyledArchiveText = styled.text`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 4px 8px;
  color: #df7777;
`

const InlineBlock = (props: any) => {
  const { goTo } = useRouting()
  const { getPathFromNodeid } = useLinks()
  const { getNodeType } = useNodes()
  const publicNamespaceMatch = useMatch(`${ROUTE_PATHS.namespaceShare}/:namespaceid/node/:nodeid`)
  const getContent = useContentStore((store) => store.getContent)
  const path = useMemo(() => getPathFromNodeid(props.element.value, true), [props.element.value])
  const nodeid = props.element.value
  const blockId = props.element.blockId
  const nodeType = getNodeType(nodeid)

  const content = useMemo(() => {
    if (blockId) {
      const data = getBlock(nodeid, blockId)
      return data ? [data] : undefined
    }
    const data = getContent(nodeid)?.content

    return data
  }, [nodeid, blockId])

  const { archived } = useArchive()

  const openNode = (ev: any) => {
    ev.preventDefault()
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const openPublicNode = (ev: any) => {
    ev.preventDefault()
    if (publicNamespaceMatch) {
      goTo(`${ROUTE_PATHS.namespaceShare}/${publicNamespaceMatch.params.namespaceid}/node`, NavigationType.push, nodeid)
    } else {
      goTo(ROUTE_PATHS.share, NavigationType.push, nodeid)
    }
  }

  const selected = useSelected()
  // mog('InlineBlock', { nodeid, selected, content, nodeType, path })

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            {nodeType !== NodeType.MISSING && (
              <InlineFlex>
                <InlineBlockHeading>{blockId ? 'Within:' : 'From:'}</InlineBlockHeading>
                {nodeType === NodeType.SHARED && <SharedNodeIcon />}
                <InlineBlockText>{path}</InlineBlockText>
              </InlineFlex>
            )}
            {
              {
                [NodeType.ARCHIVED]: <StyledArchiveText>Archived</StyledArchiveText>,
                [NodeType.MISSING]: <StyledArchiveText>Private/Missing</StyledArchiveText>,
                [NodeType.SHARED]: <Chip onClick={openNode}>Open</Chip>,
                [NodeType.DEFAULT]: <Chip onClick={openNode}>Open</Chip>,
                [NodeType.PUBLIC]: <Chip onClick={openPublicNode}>Open</Chip>
              }[nodeType]
            }
          </FlexBetween>
          {(nodeType === NodeType.SHARED || nodeType === NodeType.DEFAULT) && (
            <StyledInlineBlockPreview>
              <EditorPreviewRenderer content={content} editorId={`__preview__${blockId ?? nodeid}`} />
            </StyledInlineBlockPreview>
          )}
        </StyledInlineBlock>
      </div>
      {props.children}
    </RootElement>
  )
}

export default InlineBlock
