import React, { useMemo } from 'react'

import closeLine from '@iconify/icons-ri/close-line'
import { Icon } from '@iconify/react'
import { capitalize } from 'lodash'

import { Filter, FilterValue, FilterJoin, FilterType, mog } from '@mexit/core'
import {
  FilterJoinDiv,
  IconDisplay,
  Menu,
  MenuItem,
  ItemLabel,
  FilterTypeIcons,
  FilterValueDiv,
  FilterWrapper,
  FilterRemoveButton,
  FilterTypeDiv,
  GenericFlex
} from '@mexit/shared'

import { useFilterIcons, getFilterJoinIcon } from '../../Hooks/useFilterValueIcons'

interface FilterProps {
  filter: Filter
  options: FilterValue[]
  onChangeFilter: (filter: Filter) => void
  onRemoveFilter: (filter: Filter) => void
}

const JoinLabels = {
  any: 'Any of',
  all: 'All of',
  none: 'None of',
  notAny: 'Not Any of'
}

const JoinOptions = ['all', 'any', 'notAny', 'none'].map((join) => ({
  label: JoinLabels[join],
  value: join as FilterJoin
}))

const getJoinOptionsForType = (type: FilterType) => {
  switch (type) {
    case 'note':
      return JoinOptions
    case 'tag':
      return JoinOptions
    case 'space':
      return JoinOptions.filter((join) => join.value !== 'all' && join.value !== 'notAny')
    case 'mention':
      return JoinOptions
    default:
      return JoinOptions
  }
}

/**
 * Renders a filter
 */
const FilterRender = ({ filter, onChangeFilter, options, onRemoveFilter }: FilterProps) => {
  const { getFilterValueIcon } = useFilterIcons()

  const onChangeJoin = (join: FilterJoin) => {
    onChangeFilter({ ...filter, join })
  }

  const onChangeValues = (value: FilterValue) => {
    // const isSelected
    const isSelected = isValueSelected(value)
    if (!isSelected) {
      const newValues = Array.isArray(filter.values) ? [...filter.values, value] : [value]
      onChangeFilter({ ...filter, values: newValues })
    } else {
      // If it is single select, then remove all values and use []
      const newValues = Array.isArray(filter.values) ? filter.values.filter((v) => v.id !== value.id) : []
      onChangeFilter({ ...filter, values: newValues })
    }
  }

  const isValueSelected = (value: FilterValue) => {
    if (Array.isArray(filter.values)) {
      return filter.values.some((v) => v.id === value.id)
    }
    return filter.values.id === value.id
  }

  const joinOptions = useMemo(() => getJoinOptionsForType(filter.type), [filter.type])

  return (
    <FilterWrapper>
      {/* Cannot change filter type */}
      <FilterTypeDiv>
        <Icon icon={FilterTypeIcons[filter.type]} />
        {capitalize(filter.type)}
      </FilterTypeDiv>

      {/*
        Can change the filter join
        Join options are always all, any, notAny, none
      */}
      <Menu
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

      <Menu
        allowSearch
        searchPlaceholder="Search Notes"
        multiSelect
        values={
          <>
            {/* Conditionally render values if value is an array otherwise simple */}
            {Array.isArray(filter.values) ? (
              filter.values.length > 0 ? (
                filter.values.map((value) => (
                  <FilterValueDiv key={value.id}>
                    <IconDisplay icon={getFilterValueIcon(filter.type, value.value)} />
                    <ItemLabel>{value.label}</ItemLabel>
                  </FilterValueDiv>
                ))
              ) : (
                <FilterValueDiv>0 selected</FilterValueDiv>
              )
            ) : (
              <FilterValueDiv>
                <IconDisplay icon={getFilterValueIcon(filter.type, filter.values.value)} />
                {filter.values.label}
              </FilterValueDiv>
            )}
          </>
        }
      >
        {options
          // Sort by the number of matches
          .sort((a, b) => (a.count && b.count ? b.count - a.count : 0))
          // Sort whether the value is selected
          .sort((a, b) => (isValueSelected(a) ? -1 : 1))
          .map((option) => (
            <MenuItem
              key={option.id}
              icon={getFilterValueIcon(filter.type, option.value)}
              onClick={() => onChangeValues(option)}
              label={option.label}
              selected={isValueSelected(option)}
              count={option.count}
              multiSelect
            />
          ))}
      </Menu>

      <FilterRemoveButton onClick={() => onRemoveFilter(filter)}>
        <Icon height={16} icon={closeLine} />
      </FilterRemoveButton>
    </FilterWrapper>
  )
}

export const DisplayFilter = ({ filter }: { filter: Filter }) => {
  const { getFilterValueIcon } = useFilterIcons()
  mog('filter', { filter })
  return (
    <FilterWrapper>
      {/* Cannot change filter type */}
      <FilterTypeDiv>
        <Icon icon={FilterTypeIcons[filter.type]} />
        {capitalize(filter.type)}
      </FilterTypeDiv>

      {/*
        Can change the filter join
        Join options are always all, any, notAny, none
      */}
      <GenericFlex>
        <FilterJoinDiv>
          <IconDisplay icon={getFilterJoinIcon(filter.join)} />
          {JoinLabels[filter.join]}
        </FilterJoinDiv>
      </GenericFlex>

      <GenericFlex>
        <>
          {/* Conditionally render values if value is an array otherwise simple */}
          {Array.isArray(filter.values) ? (
            filter.values.length > 0 ? (
              filter.values.map((value) => (
                <FilterValueDiv key={value.id}>
                  <IconDisplay icon={getFilterValueIcon(filter.type, value.value)} />
                  <ItemLabel>{value.label}</ItemLabel>
                </FilterValueDiv>
              ))
            ) : (
              <FilterValueDiv>0 selected</FilterValueDiv>
            )
          ) : (
            <FilterValueDiv>
              <IconDisplay icon={getFilterValueIcon(filter.type, filter.values.value)} />
              {filter.values.label}
            </FilterValueDiv>
          )}
        </>
      </GenericFlex>
    </FilterWrapper>
  )
}

export default FilterRender
