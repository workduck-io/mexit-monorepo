import React, { useMemo } from 'react'
import { useSelected } from 'slate-react'
import styled from 'styled-components'

import { RootElement } from '@mexit/shared'

import { useContentStore } from '../../../Stores/useContentStore'
import useArchive from '../../../Hooks/useArchive'
import { useLinks } from '../../../Hooks/useLinks'
import { useNavigation } from '../../../Hooks/useNavigation'
import { useSaver } from '../../../Hooks/useSaver'
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
import { getBlock } from '../../../Utils/parseData'

const StyledArchiveText = styled.text`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 4px 8px;
  color: #df7777;
`

const InlineBlock = (props: any) => {
  const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  const getContent = useContentStore((store) => store.getContent)
  const path = useMemo(() => getPathFromNodeid(props.element.value), [props.element.value])
  const nodeid = props.element.value
  const blockId = props.element.blockId

  const content = useMemo(() => {
    if (blockId) {
      const data = getBlock(nodeid, blockId)
      return data ? [data] : undefined
    }
    const data = getContent(nodeid)?.content

    return data
  }, [nodeid, blockId])

  const { onSave } = useSaver()
  const { archived } = useArchive()

  const openNode = (ev: any) => {
    ev.preventDefault()
    onSave()
    push(nodeid)
  }

  const selected = useSelected()

  return (
    <RootElement {...props.attributes}>
      <div contentEditable={false}>
        <StyledInlineBlock selected={selected} data-tour="mex-onboarding-inline-block">
          <FlexBetween>
            <InlineFlex>
              <InlineBlockHeading>{blockId ? 'Within:' : 'From:'}</InlineBlockHeading>
              <InlineBlockText>{path}</InlineBlockText>
            </InlineFlex>
            {archived(nodeid) ? <StyledArchiveText>Archived</StyledArchiveText> : <Chip onClick={openNode}>Open</Chip>}
          </FlexBetween>
          {!archived(nodeid) && (
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
