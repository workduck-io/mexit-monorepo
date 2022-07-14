import React from 'react'
import styled from 'styled-components'

import Outline from './Outline'
import Backlinks from './Backlinks'
import TagsRelated from '../Editor/TagsRelated'
import { useEditorStore } from '../../Stores/useEditorStore'
import { DataInfobarWrapper } from '@mexit/shared'

const DataInfoBar = () => {
  const node = useEditorStore((state) => state.node)

  return (
    <DataInfobarWrapper>
      <Outline editorId={node.nodeid} />
      <Backlinks nodeid={node.nodeid} />
      <TagsRelated nodeid={node.nodeid} fromAnalysis />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
