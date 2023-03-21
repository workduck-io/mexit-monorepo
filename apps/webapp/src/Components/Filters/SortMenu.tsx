import React from 'react'

import { capitalize, SEPARATOR, SortOrder, SortType } from '@mexit/core'
import {
  FilterDescription,
  FilterGlobalJoinWrapper,
  GenericSection,
  IconDisplay,
  Menu,
  MenuItem,
  SortOrderWrapper,
  SortSectionWrapper,
  SortTypeWrapper
} from '@mexit/shared'

import { useViewFilterStore } from '../../Hooks/todo/useTodoFilters'
import { getBlockFieldIcon, getSortOrderIcon } from '../../Hooks/useSortIcons'

export interface SortMenuProps {
  sortOrder: SortOrder
  sortType: SortType
  onSortOrderChange: (sortOrder: SortOrder) => void
  onSortTypeChange: (sortType: SortType) => void
}

const SortMenu = ({ sortOrder, sortType, onSortOrderChange, onSortTypeChange }: SortMenuProps) => {
  const sortOptions = useViewFilterStore((store) => store.sortOptions)

  return (
    <SortSectionWrapper>
      <Menu
        noHover
        values={
          <SortOrderWrapper>
            <IconDisplay icon={getSortOrderIcon(sortOrder)} />
          </SortOrderWrapper>
        }
      >
        <MenuItem
          icon={getSortOrderIcon('ascending')}
          onClick={() => onSortOrderChange('ascending')}
          label={'Ascending'}
        />
        <MenuItem
          icon={getSortOrderIcon('descending')}
          onClick={() => onSortOrderChange('descending')}
          label={'Descending'}
        />
      </Menu>
      {sortOptions?.length > 0 && (
        <Menu
          noHover
          key={sortOptions.length}
          values={
            <SortTypeWrapper>
              <IconDisplay icon={getBlockFieldIcon(sortType.split(SEPARATOR).at(-1))} />
              {sortType ? capitalize(sortType.split(SEPARATOR).at(-1)) : 'Sort By'}
            </SortTypeWrapper>
          }
        >
          <FilterDescription>Sort By</FilterDescription>
          {sortOptions.map((option) => (
            <MenuItem
              key={`sort-${option.label}`}
              icon={option.icon}
              onClick={() => onSortTypeChange(option.id)}
              label={capitalize(option.label)}
            />
          ))}
        </Menu>
      )}
    </SortSectionWrapper>
  )
}

export default SortMenu

export const RenderSort = ({
  sortType = 'status',
  sortOrder = 'ascending'
}: Pick<SortMenuProps, 'sortType' | 'sortOrder'>) => {
  return (
    <FilterGlobalJoinWrapper>
      <GenericSection>
        <IconDisplay icon={getSortOrderIcon(sortOrder)} />
        {capitalize(sortType)}
      </GenericSection>
    </FilterGlobalJoinWrapper>
  )
}
