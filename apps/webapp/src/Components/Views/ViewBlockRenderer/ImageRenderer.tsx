import { useTheme } from 'styled-components'

import { SearchResult } from '@workduck-io/mex-search'

import { Group, GroupHeader, MexIcon } from '@mexit/shared'

import { SearchBlockIcons } from '../../../Editor/Components/Blocks/BlockIcons'

import { BlockContainer, ImageContainer } from './styled'

type BlockProps = {
  block: SearchResult
}

const ImageRenderer: React.FC<BlockProps> = ({ block }) => {
  const theme = useTheme()
  if (!block.data.url) return null
  return (
    <BlockContainer>
      <GroupHeader>
        <Group>
          <MexIcon
            color={theme.tokens.colors.primary.default}
            width={20}
            height={20}
            icon={SearchBlockIcons[block?.entity]}
          />
          {block.text}
        </Group>
      </GroupHeader>
      <ImageContainer>
        <img loading="lazy" alt="image-preview" src={block.data.url} />
      </ImageContainer>
    </BlockContainer>
  )
}

export default ImageRenderer
