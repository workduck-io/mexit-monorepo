import { useEditorStore } from '@mexit/core'
import { DataInfobarHeader, DataInfobarWrapper, MexIcon, Title } from '@mexit/shared'

import { Assistant } from '../Assistant'
import TagsRelated, { TagsRelatedSuggestions } from '../Editor/TagsRelated'

import Backlinks from './Backlinks'
import Outline from './Outline'

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
      <TagsRelatedSuggestions nodeid={node.nodeid} fromAnalysis />
      <Outline editorId={node.nodeid} />
      <Backlinks nodeid={node.nodeid} />
      <Assistant nodeId={node.nodeid} />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
