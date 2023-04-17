import React, { useMemo } from 'react'

import closeLine from '@iconify/icons-ri/close-line'

import { Filter, FilterJoin, FilterType, FilterValue } from '@mexit/core'
import {
  FilterDivWrapper,
  FilterJoinDiv,
  FilterValueDiv,
  FilterWithCrossWrapper,
  FilterWrapper,
  GenericFlex,
  IconDisplay,
  ItemLabel,
  Menu,
  MenuItem,
  MexIcon
} from '@mexit/shared'

import { getFilterJoinIcon, useFilterIcons } from '../../Hooks/useFilterValueIcons'
import { Group } from '../Editor/Banner/styled'

interface FilterProps {
  filter: Filter
  options: FilterValue[]
  hideJoin?: boolean
  onChangeFilter: (filter: Filter) => void
  onRemoveFilter: (filter: Filter) => void
}

const JoinLabels = {
  any: 'or',
  all: 'and'
}

const JoinOptions = ['any', 'all'].map((join) => ({
  label: JoinLabels[join],
  value: join as FilterJoin
}))

const getJoinOptionsForType = (type: FilterType) => {
  switch (type) {
    default:
      return JoinOptions
  }
}

/**
 * Renders a filter
 */
const FilterRender = ({ filter, onChangeFilter, options, onRemoveFilter, hideJoin }: FilterProps) => {
  const multiSelect = false
  const { getFilterValueIcon } = useFilterIcons()

  const onChangeJoin = (join: FilterJoin) => {
    onChangeFilter({ ...filter, join })
  }

  const onChangeValue = (value: FilterValue) => {
    if (multiSelect) {
      const isSelected = isValueSelected(value)
      if (!isSelected) {
        const newValues = Array.isArray(filter.values) ? [...filter.values, value] : [value]
        onChangeFilter({ ...filter, values: newValues })
      } else {
        // If it is single select, then remove all values and use []
        const newValues = Array.isArray(filter.values) ? filter.values.filter((v) => v.id !== value.id) : []
        onChangeFilter({ ...filter, values: newValues })
      }
    } else {
      onChangeFilter({ ...filter, values: [value] })
    }
  }

  const isValueSelected = (value: FilterValue) => {
    if (Array.isArray(filter.values)) {
      return filter.values.some((v) => v.id === value.id)
    }
  }

  const joinOptions = useMemo(() => getJoinOptionsForType(filter.type), [filter.type])

  return (
    <FilterWithCrossWrapper>
      <Menu
        allowSearch
        noHover
        searchPlaceholder="Search Notes"
        multiSelect={multiSelect}
        values={
          <>
            {/* Conditionally render values if value is an array otherwise simple */}
            {Array.isArray(filter.values) &&
              (filter.values.length > 0 ? (
                filter.values.map((value) => (
                  <React.Fragment key={value.id}>
                    <FilterValueDiv>
                      <IconDisplay size={14} icon={getFilterValueIcon(filter.type, value.value)} />
                      <ItemLabel>{value.label}</ItemLabel>
                    </FilterValueDiv>
                    <MexIcon
                      height={16}
                      icon={closeLine}
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveFilter(filter)
                      }}
                    />
                  </React.Fragment>
                ))
              ) : (
                <FilterValueDiv>0 selected</FilterValueDiv>
              ))}
          </>
        }
      >
        {options
          // Sort by the number of matches
          .sort((a, b) => (a.count && b.count ? b.count - a.count : 0))
          // Sort whether the value is selected
          .sort((a, b) => (isValueSelected(a) ? -1 : 1))
          .map((option) => {
            return (
              <MenuItem
                key={option.id}
                icon={getFilterValueIcon(filter.type, option.value)}
                onClick={() => onChangeValue(option)}
                label={option.label}
                selected={isValueSelected(option)}
                count={option.count}
                multiSelect={multiSelect}
              />
            )
          })}
      </Menu>

      {/* </FilterItemWrapper> */}

      {!hideJoin && (
        <Menu
          noBackground
          values={
            <FilterJoinDiv>
              <IconDisplay icon={getFilterJoinIcon(filter.join)} />
              {JoinLabels[filter.join]}
            </FilterJoinDiv>
          }
        >
          {joinOptions.map((option) => (
            <MenuItem
              key={option.value}
              icon={getFilterJoinIcon(option.value)}
              onClick={() => onChangeJoin(option.value)}
              label={option.label}
            />
          ))}
        </Menu>
      )}
    </FilterWithCrossWrapper>
  )
}

export const DisplayFilter = ({ filter, hideJoin }: { filter: Filter; hideJoin?: boolean }) => {
  const { getFilterValueIcon } = useFilterIcons()
  return (
    <FilterWrapper>
      <GenericFlex>
        {Array.isArray(filter.values) &&
          (filter.values.length > 0 ? (
            filter.values.map((value) => (
              <FilterDivWrapper key={value.id}>
                <Group>
                  <IconDisplay size={14} icon={getFilterValueIcon(filter.type, value.value)} />
                  <ItemLabel>{value.label}</ItemLabel>
                </Group>
              </FilterDivWrapper>
            ))
          ) : (
            <FilterDivWrapper>0 selected</FilterDivWrapper>
          ))}
      </GenericFlex>
      {!hideJoin && (
        <GenericFlex>
          <FilterJoinDiv>
            <IconDisplay icon={getFilterJoinIcon(filter.join)} />
            {JoinLabels[filter.join]}
          </FilterJoinDiv>
        </GenericFlex>
      )}
    </FilterWrapper>
  )
}

export default FilterRender
