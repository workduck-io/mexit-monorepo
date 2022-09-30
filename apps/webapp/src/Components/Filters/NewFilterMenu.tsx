import React, { useEffect } from 'react'

import filter2Line from '@iconify/icons-ri/filter-2-line'
import { Icon } from '@iconify/react'

import { DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { Filter, Filters, FilterType, FilterValue, generateFilterId } from '@mexit/core'
import { FilterTypeIcons } from '@mexit/shared'

import { useFilterIcons } from '../../Hooks/useFilterValueIcons'
import { useEnableShortcutHandler } from '../../Hooks/useShortcutListener'
import { Menu, MenuItem } from '../FloatingElements/Dropdown'
import { GenericFlex, FilterMenuDiv } from './Filter.style'

interface NewFilterMenuProps {
  filters: Filters
  addFilter: (filter: Filter) => void
  removeLastFilter: () => void
}

const NewFilterClassName = 'new-filter-menu'

const NewFilterMenu = ({ addFilter, filters, removeLastFilter }: NewFilterMenuProps) => {
  const { getFilterValueIcon } = useFilterIcons()
  const { enableShortcutHandler } = useEnableShortcutHandler()
  const onAddNewFilter = (type: FilterType, value: FilterValue) => {
    const newFilter: Filter = {
      id: generateFilterId(),
      type,
      multiple: true,
      // Be default the newly added filter has 'any' join
      join: 'any',
      values: [value]
    }
    // mog('onAddNewFilter', { type, newFilter, value })
    addFilter(newFilter)
  }

  // mog('NewFilterMenu', { filters })

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      F: (event) => {
        enableShortcutHandler(
          () => {
            event.preventDefault()
            event.stopPropagation()
            const newFilterMenus = document.getElementsByClassName(NewFilterClassName)
            if (newFilterMenus.length > 0) {
              // Open the first menu as there will be never more than one
              const first = newFilterMenus[0] as HTMLElement
              first.click()
            }
          },
          {
            skipLocal: false,
            ignoreClasses: 'input'
          }
        )
      },
      'Shift+F': (event) => {
        enableShortcutHandler(
          () => {
            event.preventDefault()
            event.stopPropagation()
            removeLastFilter()
          },
          {
            skipLocal: false,
            ignoreClasses: 'input'
          }
        )
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <Menu
      className={NewFilterClassName}
      values={
        <FilterMenuDiv>
          <Icon icon={filter2Line} />
          Filter
          <DisplayShortcut shortcut={'F'} />
        </FilterMenuDiv>
      }
    >
      {filters.map((option) => (
        <Menu
          key={option.type}
          values={
            <GenericFlex>
              <Icon icon={FilterTypeIcons[option.type]} />
              {option.label}
            </GenericFlex>
          }
          allowSearch
          searchPlaceholder={`Search ${option.label}`}
        >
          {option.options
            .sort((a, b) => (a.count !== undefined && b.count !== undefined ? b.count - a.count : 0))
            .map((op) => (
              <MenuItem
                key={op.id}
                icon={getFilterValueIcon(option.type, op.value)}
                onClick={() => onAddNewFilter(option.type, op)}
                label={op.label}
                count={op.count}
              />
            ))}
        </Menu>
      ))}
    </Menu>
  )
}

export default NewFilterMenu

//////// Testing things
//
// const valueOptions = (k: string): FilterValue[] =>
//   duplicateTimes([`${k} Test 1`, `${k} Test 2`, `${k} Test 3`, `${k} Test 4`, `${k} Test 5`], 20).map((value, i) => ({
//     id: `${value}_${i}`,
//     label: `${value}_${i}`,
//     value
//   }))
//
// const TypeOptions = ['note', 'tag', 'mention', 'space'].map((type) => ({
//   label: capitalize(type),
//   value: type as FilterType,
//   options: valueOptions(type)
// }))
