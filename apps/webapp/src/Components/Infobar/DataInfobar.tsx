import React from 'react'
import styled from 'styled-components'

import Outline from './Outline'
import Backlinks from './Backlinks'
import TagsRelated, { TagsRelatedSuggestions } from '../Editor/TagsRelated'
import { useEditorStore } from '../../Stores/useEditorStore'
import { DataInfobarWrapper, DataInfobarHeader, MexIcon, Title } from '@mexit/shared'
import { SidebarHeaderLite } from '../Sidebar/Sidebar.space.header'

const DataInfoBar = () => {
  const node = useEditorStore((state) => state.node)

  return (
    <DataInfobarWrapper>
      <DataInfobarHeader>
        <Title>
          <MexIcon icon="fluent:content-view-gallery-24-regular" width={24} height={24} />
          Note Context
        </Title>
      </DataInfobarHeader>
      <TagsRelated nodeid={node.nodeid} fromAnalysis />
      <TagsRelatedSuggestions nodeid={node.nodeid} />
      <Outline editorId={node.nodeid} />
      <Backlinks nodeid={node.nodeid} />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
