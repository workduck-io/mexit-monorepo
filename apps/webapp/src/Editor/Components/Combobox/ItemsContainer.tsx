import { ItemsContainer as StyledItemsContainer } from '@mexit/shared'

import { useNamespaces } from '../../../Hooks/useNamespaces'
import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { useMetadataStore } from '../../../Stores/useMetadataStore'
import { QuickLinkType } from '../../constants'

import Item from './Item'

const ItemsContainer: React.FC<{ items?: any; onRenderItem?: any; comboProps?: any; onSelectItem }> = ({
  items,
  onSelectItem,
  onRenderItem,
  comboProps
}) => {
  const { getNamespace } = useNamespaces()
  const allMetadata = useMetadataStore((s) => s.metadata)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)

  return (
    <StyledItemsContainer id="items-container">
      {items.map((item, index) => {
        const renderItem = onRenderItem ? onRenderItem({ item }) : item.text
        const lastItem = index > 0 ? items[index - 1] : undefined
        const description = getNamespace(item.namespace)?.name
        const isSnippet = item.type === QuickLinkType.snippet
        const metadata = allMetadata[isSnippet ? 'snippets' : 'notes']?.[item.key]
        const icon = metadata?.icon ?? item?.icon

        return (
          <Item
            icon={icon}
            description={description}
            key={item.key}
            title={renderItem}
            comboProps={comboProps}
            onHover={() => {
              setItemIndex(index)
            }}
            onClick={onSelectItem}
            index={index}
            item={item}
            showCategory={item.type !== lastItem?.type}
          />
        )
      })}
    </StyledItemsContainer>
  )
}

export default ItemsContainer
