import React, { useEffect } from 'react'

import { Icon } from '@iconify/react'

import { tinykeys } from '@workduck-io/tinykeys'

import { Filter, Filters, FilterType, FilterValue, generateFilterId } from '@mexit/core'
import {
  DefaultMIcons,
  DisplayShortcut,
  FilterMenuDiv,
  FilterTypeIcons,
  GenericFlex,
  Group,
  IconDisplay,
  Menu,
  MenuItem
} from '@mexit/shared'

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
          <IconDisplay size={14} icon={DefaultMIcons.ADD} />
          <Group>
            <span>Add Filter</span>
            <DisplayShortcut shortcut="F" />
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
