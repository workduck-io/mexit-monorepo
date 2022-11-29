import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import gridLine from '@iconify/icons-ri/grid-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { capitalize,mog } from '@mexit/core'
import { SearchFilterInputWrapper, SearchIndexValue, StyledCombobox, StyledMenu, Suggestion } from '@mexit/shared'
import { useCombobox } from 'downshift'
import React, { useState } from 'react'

import Input from '../Input'

interface SearchIndexInputProps {
  indexGroups: string[]
  onChange: (indexGroup: string) => void
  placeholder?: string
}

const indexIcons = {
  all: gridLine,
  notes: fileList2Line,
  snippets: quillPenLine
}

const SearchIndexInput = ({ indexGroups, onChange, placeholder }: SearchIndexInputProps) => {
  const [inputItems, setInputItems] = useState(indexGroups)
  const [selectedGroup, setSelectedGroup] = useState(indexGroups[0])
  const {
    isOpen,
    // getToggleButtonProps,
    // getLabelProps,
    toggleMenu,
    // openMenu,
    closeMenu,
    selectItem,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    setInputValue,
    getItemProps
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(indexGroups.filter((item) => item.toLowerCase().startsWith(inputValue.toLowerCase())))
    },
    onIsOpenChange: ({ isOpen }) => {
      if (!isOpen) {
        selectItem(null)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        mog('selectedItem', { selectedItem, indexGroups })
        onChange(selectedItem)
        setSelectedGroup(selectedItem)
        setInputValue('')
        closeMenu()
      }
    }
  })
  return (
    <SearchFilterInputWrapper isOverlay>
      <StyledCombobox {...getComboboxProps()}>
        <SearchIndexValue onClick={() => toggleMenu()}>
          <Icon icon={indexIcons[selectedGroup] ?? arrowDownSLine} />
          {capitalize(selectedGroup)}
          <Icon icon={arrowDownSLine} />
        </SearchIndexValue>

        <Input
          {...getInputProps()}
          style={{ display: 'none' }}
          placeholder={`Search in...`}
          className={`FilterInput`}
        />
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOverlay isOpen={isOpen}>
        {isOpen &&
          inputItems.map((item, index) => (
            <Suggestion
              highlight={highlightedIndex === index}
              key={`${item}_${index}`}
              {...getItemProps({ item, index })}
            >
              <Icon icon={indexIcons[item] ?? gridLine} />
              {capitalize(item)}
            </Suggestion>
          ))}
      </StyledMenu>
    </SearchFilterInputWrapper>
  )
}

export default SearchIndexInput
