import { Icon } from '@iconify/react'

import { MIcon } from '@mexit/core'
import {
  ActionTitle,
  ComboboxItem,
  ComboboxItemTitle,
  IconDisplay,
  ItemCenterWrapper,
  ItemDesc,
  ItemRightIcons,
  PrimaryText,
  SectionSeparator
} from '@mexit/shared'

import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { IComboboxItem } from '../../Types/Combobox'

const Item: React.FC<{
  item: IComboboxItem
  icon: MIcon
  index: number
  description?: string
  comboProps?: any
  title: any
  showCategory?: boolean
  onHover?: any
  onClick?: any
}> = ({ item, showCategory, comboProps, description, index, title, onClick, onHover, icon }) => {
  const itemIndex = useComboboxStore((s) => s.itemIndex)

  return (
    <span key={`mexit-suggestion-item$-${item.key}`}>
      {showCategory && (
        <>
          {index !== 0 && <SectionSeparator />}
          <ActionTitle>{item.type}</ActionTitle>
        </>
      )}
      <ComboboxItem
        className={index === itemIndex ? 'highlight' : ''}
        {...comboProps(item, index)}
        onMouseEnter={onHover}
        center={!description}
        onMouseDown={() => onClick(item)}
      >
        {icon && <IconDisplay icon={icon} size={description ? 16 : 18} />}
        <ItemCenterWrapper>
          {!item.prefix ? (
            <ComboboxItemTitle>{title}</ComboboxItemTitle>
          ) : (
            <ComboboxItemTitle>
              {item.prefix} <PrimaryText>{title}</PrimaryText>
            </ComboboxItemTitle>
          )}
          {description && <ItemDesc>{description}</ItemDesc>}
        </ItemCenterWrapper>
        {item.rightIcons && (
          <ItemRightIcons>
            {item.rightIcons.map((i: string) => (
              <Icon key={item.key + i} icon={i} />
            ))}
          </ItemRightIcons>
        )}
      </ComboboxItem>
    </span>
  )
}

export default Item
