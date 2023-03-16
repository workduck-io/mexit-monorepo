import { useComboboxStore, useMetadataStore,usePromptStore  } from '@mexit/core'
import { ItemsContainer as StyledItemsContainer } from '@mexit/shared'

import { useNamespaces } from '../../../Hooks/useNamespaces'
import { useTaskViews } from '../../../Hooks/useTaskViews'
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
  const getPrompt = usePromptStore((s) => s.getPrompt)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const { getView } = useTaskViews()

  const getDescripton = (item: any) => {
    switch (item?.type) {
      case QuickLinkType.backlink:
        return getNamespace(item.namespace)?.name
      case QuickLinkType.prompts:
        return getPrompt(item.key)?.category
      case QuickLinkType.taskView:
        return getView(item.key)?.description
      default:
        return ''
    }
  }

  return (
    <StyledItemsContainer id="items-container">
      {items.map((item, index) => {
        const renderItem = onRenderItem ? onRenderItem({ item }) : item.text
        const lastItem = index > 0 ? items[index - 1] : undefined
        const description = getDescripton(item)
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
