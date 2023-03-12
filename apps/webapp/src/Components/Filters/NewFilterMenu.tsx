import React, { useEffect } from 'react'

import filter2Line from '@iconify/icons-ri/filter-2-line'
import { Icon } from '@iconify/react'

import { DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { Filter, Filters, FilterType, FilterValue, generateFilterId } from '@mexit/core'
import { FilterMenuDiv, FilterTypeIcons, GenericFlex, Group, Menu, MenuItem } from '@mexit/shared'

import { useEnableShortcutHandler } from '../../Hooks/useChangeShortcutListener'
import { useFilterIcons } from '../../Hooks/useFilterValueIcons'

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
      multiple: false,
      // Be default the newly added filter has 'any' join
      join: 'all',
      values: [value]
    }
    // mog('onAddNewFilter', { type, newFilter, value })z
    addFilter(newFilter)
  }

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
      border
      values={
        <FilterMenuDiv noBorder>
          <Group>
            <Group>
              <Icon icon={filter2Line} />
              <span>Filter</span>
            </Group>
            <DisplayShortcut shortcut={'F'} />
          </Group>
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
            .map((op) => {
              // mog('FILTER SAVE OPTION', { op, option })
              return (
                <MenuItem
                  key={op.id}
                  icon={getFilterValueIcon(option.type, op.value)}
                  onClick={() => onAddNewFilter(option.type, op)}
                  label={op.label}
                  count={op.count}
                />
              )
            })}
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
