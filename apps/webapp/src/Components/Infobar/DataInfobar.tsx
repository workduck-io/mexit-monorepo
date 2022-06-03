import React from 'react'
import styled from 'styled-components'

import Outline from './Outline'
import Backlinks from './Backlinks'
import TagsRelated from '../Editor/TagsRelated'
import { useEditorStore } from '../../Stores/useEditorStore'

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

const DataInfoBar = () => {
  const node = useEditorStore((state) => state.node)

  return (
    <DataInfobarWrapper>
      <Outline />
      <Backlinks nodeid={node.nodeid} />
      <TagsRelated nodeid={node.nodeid} fromAnalysis />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
