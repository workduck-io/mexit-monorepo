import { mog } from '@mexit/core'
import { useCombobox } from 'downshift'
import React, { useState } from 'react'
import { SearchFilter } from '../Hooks/useFilters'
import { Input } from '../Style/Form'
import { StyledMenu } from '../Style/Menu'
import { SearchFilterInputWrapper } from '../Style/Search'
import { StyledCombobox, Suggestion } from './NodeSelect/NodeSelect.styles'

interface SearchFilterInputProps<Item> {
  items: SearchFilter<Item>[]
  onChange: (item: SearchFilter<Item>) => void
  placeholder?: string
}
const SearchFilterInput = <Item,>({ items, onChange, placeholder }: SearchFilterInputProps<Item>) => {
  const [inputItems, setInputItems] = useState(items)
  mog('items', { items })
  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    setInputValue,
    getItemProps
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(items.filter((item) => item.label.toLowerCase().startsWith(inputValue.toLowerCase())))
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(selectedItem)
        setInputValue('')
      }
    }
  })
  return (
    <SearchFilterInputWrapper>
      <StyledCombobox {...getComboboxProps()}>
        <Input {...getInputProps()} placeholder={`Apply Filter...`} className={`FilterInput`} />
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOpen={isOpen}>
        {isOpen &&
          inputItems.map((item, index) => (
            <Suggestion
              highlight={highlightedIndex === index}
              key={`${item.label}_${index}`}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </Suggestion>
          ))}
      </StyledMenu>
    </SearchFilterInputWrapper>
  )
}

export default SearchFilterInput
