import React, { useEffect, useMemo, useState } from 'react'

import styled from 'styled-components'

import { mog, NodeEditorContent } from '@mexit/core'

import { useWindowDimensions } from '../../Hooks/useWindowDimensions'
import { analyseContent } from '../../Workers/controller'
import { PublicTagsView } from '../Editor/TagsRelated'

import Outline from './Outline'

export const DataInfobarWrapper = styled.div`
  display: none;
  height: calc(100% - 10rem);
  margin-top: 10rem;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(2 * ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 300px;
  overflow-y: auto;

  @media (min-width: 800px) {
    display: flex;
  }
`

interface PublicDataInfobarProps {
  nodeId: string
  content: NodeEditorContent
}

const PublicDataInfobar = ({ nodeId, content }: PublicDataInfobarProps) => {
  const [analysis, setAnalysis] = useState<any>()

  const windowDimensions = useWindowDimensions()

  const useWorker = useMemo(() => {
    return windowDimensions.width > 800
  }, [windowDimensions])

  useEffect(() => {
    const getAnalysis = async () => {
      const analysis = await analyseContent({ nodeid: nodeId, content: content })
      mog('RecvAnalysis', { analysis, nodeId, content })
      setAnalysis(analysis)
    }
    if (nodeId && content.length > 1 && useWorker) getAnalysis()
  }, [nodeId, content])

  return analysis ? (
    <DataInfobarWrapper>
      <Outline staticOutline={analysis.outline} editorId={nodeId} />
      <PublicTagsView nodeid={nodeId} tags={analysis.tags} />
    </DataInfobarWrapper>
  ) : null
}

export default PublicDataInfobar
