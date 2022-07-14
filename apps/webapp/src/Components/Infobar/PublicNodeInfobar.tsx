import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { NodeEditorContent, mog } from '@mexit/core'

import { analyseContent } from '../../Workers/controller'
import { PublicTagsView } from '../Editor/TagsRelated'
import Outline from './Outline'

export const DataInfobarWrapper = styled.div`
  display: flex;
  height: calc(100% - 10rem);
  margin-top: 10rem;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(2 * ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 300px;
  overflow-y: auto;
`

interface PublicDataInfobarProps {
  nodeId: string
  content: NodeEditorContent
}

const PublicDataInfobar = ({ nodeId, content }: PublicDataInfobarProps) => {
  const [analysis, setAnalysis] = useState<any>()
  useEffect(() => {
    const getAnalysis = async () => {
      const analysis = await analyseContent({ nodeid: nodeId, content: content })
      mog('RecvAnalysis', { analysis })
      setAnalysis(analysis)
    }
    getAnalysis()
  }, [nodeId, content]) // eslint-disable-line

  return analysis ? (
    <DataInfobarWrapper>
      <Outline staticOutline={analysis.outline} editorId={nodeId} />
      <PublicTagsView nodeid={nodeId} tags={analysis.tags} />
    </DataInfobarWrapper>
  ) : null
}

export default PublicDataInfobar
