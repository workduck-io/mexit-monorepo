import React, { useState } from 'react'

import { Icon } from '@iconify/react'
import { useCombobox } from 'downshift'
import { startCase } from 'lodash'

import { FilterKey, mog, SearchFilter } from '@mexit/core'
import {
  StyledMenu,
  Input,
  SearchFilterInputWrapper,
  StyledCombobox,
  Suggestion,
  SearchFilterCategoryLabel,
  SearchFilterCount,
  SearchFilterListCurrent,
  SearchFilterStyled,
  FilterComboboxToggle
} from '@mexit/shared'

interface SearchFilterInputProps<Item> {
  filterKey: FilterKey
  items: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  onChange: (item: SearchFilter<Item>) => void
  removeCurrentFilter: (filter: SearchFilter<Item>) => void
  icon: string
  placeholder?: string
}

const SearchFilterInput = <Item,>({
  items,
  icon,
  removeCurrentFilter,
  filterKey,
  currentFilters,
  onChange,
  placeholder
}: SearchFilterInputProps<Item>) => {
  const [inputItems, setInputItems] = useState(items)
  const {
    isOpen,
    getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    openMenu,
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
    <>
      <FilterComboboxToggle {...getToggleButtonProps()}>
        <Icon icon={icon} />
        <SearchFilterCategoryLabel>{startCase(filterKey)}</SearchFilterCategoryLabel>
        {currentFilters.length > 0 && (
          <SearchFilterListCurrent>
            {currentFilters.map((f) => (
              <SearchFilterStyled
                selected
                key={`current_f_${f.id}`}
                onClick={() => {
                  removeCurrentFilter(f)
                  // updateResults()
                }}
              >
                {f.icon ? <Icon icon={f.icon} /> : null}
                {f.label}
                {f.count && <SearchFilterCount>{f.count}</SearchFilterCount>}
              </SearchFilterStyled>
            ))}
          </SearchFilterListCurrent>
        )}
      </FilterComboboxToggle>
      <StyledCombobox {...getComboboxProps()}>
        <SearchFilterInputWrapper>
          <Input
            {...getInputProps()}
            onFocus={() => openMenu()}
            placeholder={placeholder ?? `Apply Filter...`}
            className={`FilterInput`}
          />
          <StyledMenu {...getMenuProps()} isOpen={isOpen}>
            {isOpen &&
              inputItems.map((item, index) => (
                <Suggestion
                  highlight={highlightedIndex === index}
                  key={`${item.label}_${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.key === 'tag' && '#'} {item.label}
                </Suggestion>
              ))}
          </StyledMenu>
        </SearchFilterInputWrapper>
      </StyledCombobox>
    </>
  )
}

export default SearchFilterInput
