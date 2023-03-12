import React from 'react'

import { capitalize, SortOrder, SortType } from '@mexit/core'
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

import { getSortOrderIcon, getSortTypeIcon } from '../../Hooks/useSortIcons'

export interface SortMenuProps {
  sortOrder: SortOrder
  sortType: SortType
  availableSortTypes: SortType[]
  onSortOrderChange: (sortOrder: SortOrder) => void
  onSortTypeChange: (sortType: SortType) => void
}

const SortMenu = ({ sortOrder, sortType, availableSortTypes, onSortOrderChange, onSortTypeChange }: SortMenuProps) => {
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
      <Menu
        values={
          <SortTypeWrapper>
            <IconDisplay icon={getSortTypeIcon(sortType)} />
            {capitalize(sortType)}
          </SortTypeWrapper>
        }
      >
        {availableSortTypes.map((type) => (
          <MenuItem icon={getSortTypeIcon(type)} onClick={() => onSortTypeChange(type)} label={capitalize(type)} />
        ))}
      </Menu>
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
