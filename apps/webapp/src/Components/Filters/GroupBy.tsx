import { useParams } from 'react-router-dom'

import { capitalize, SEPARATOR } from '@mexit/core'
import {
  DefaultMIcons,
  FilterDescription,
  FilterGlobalJoinWrapper,
  IconDisplay,
  Menu,
  MenuItem,
  SmallGap,
  SortSectionWrapper
} from '@mexit/shared'

import { useViewFilterStore } from '../../Hooks/todo/useTodoFilters'

const GroupByMenu = ({ onChange }) => {
  const viewId = useParams().viewid
  const groupBy = useViewFilterStore((store) => store.groupBy)
  const groupingOptions = useViewFilterStore((store) => store.groupingOptions)

  if (!groupingOptions?.length) return null

  return (
    <SortSectionWrapper>
      <Menu
        border
        noHover
        key={`${viewId}-${groupingOptions?.length}`}
        values={
          <SmallGap>
            <IconDisplay icon={DefaultMIcons.GROUPBY} />
            {groupBy ? capitalize(groupBy?.split(SEPARATOR)?.at(-1)) : 'Group By'}
          </SmallGap>
        }
      >
        <FilterDescription>Group By</FilterDescription>
        {groupingOptions.map((option) => {
          return (
            <MenuItem
              key={option.label}
              icon={option.icon}
              onClick={() => onChange(option.id)}
              label={capitalize(option.label)}
            />
          )
        })}
      </Menu>
    </SortSectionWrapper>
  )
}

export const DisplayGroupBy = () => {
  const groupBy = useViewFilterStore((store) => store.groupBy)

  if (!groupBy) return

  return (
    <FilterGlobalJoinWrapper>
      <SmallGap>
        <IconDisplay icon={DefaultMIcons.GROUPBY} />
        {groupBy ? capitalize(groupBy?.split(SEPARATOR)?.at(-1)) : 'Group By'}
      </SmallGap>
    </FilterGlobalJoinWrapper>
  )
}

export default GroupByMenu
