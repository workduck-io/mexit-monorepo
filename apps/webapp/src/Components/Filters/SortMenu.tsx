import React from 'react'

import { capitalize, SEPARATOR, SortOrder, SortType } from '@mexit/core'
import {
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
import { getSortOrderIcon, getSortTypeIcon } from '../../Hooks/useSortIcons'

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
          key={sortOptions.length}
          values={
            <SortTypeWrapper>
              {/* <IconDisplay icon={getSortTypeIcon(sortType)} /> */}
              {sortType ? capitalize(sortType.split(SEPARATOR).at(-1)) : 'Sort By'}
            </SortTypeWrapper>
          }
        >
          {sortOptions.map((option) => (
            <MenuItem icon={option.icon} onClick={() => onSortTypeChange(option.id)} label={capitalize(option.label)} />
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
        {sortOrder === 'ascending' ? 'Asc' : 'Desc'}
      </GenericSection>

      <GenericSection>
        <IconDisplay icon={getSortTypeIcon(sortType)} size={14} />
        {capitalize(sortType)}
      </GenericSection>
    </FilterGlobalJoinWrapper>
  )
}
