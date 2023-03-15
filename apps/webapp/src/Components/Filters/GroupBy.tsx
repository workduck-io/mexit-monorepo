import { useParams } from 'react-router-dom'

import { SEPARATOR } from '@mexit/core'
import { DefaultMIcons, GenericSection, IconDisplay, Menu, MenuItem, SortSectionWrapper } from '@mexit/shared'

import { useViewFilterStore } from '../../Hooks/todo/useTodoFilters'

const GroupByMenu = ({ onChange }) => {
  const viewId = useParams().viewid
  const groupBy = useViewFilterStore((store) => store.groupBy)
  const groupingOptions = useViewFilterStore((store) => store.groupingOptions)

  return (
    <SortSectionWrapper>
      <Menu
        key={`${viewId}-${groupingOptions?.length}`}
        values={
          <GenericSection>
            <IconDisplay icon={DefaultMIcons.GROUPBY} />
            {groupBy?.split(SEPARATOR)?.at(-1) ?? 'Group By'}
          </GenericSection>
        }
      >
        {groupingOptions?.map((option) => {
          return <MenuItem icon={option.icon} onClick={() => onChange(option.id)} label={option.label} />
        })}
      </Menu>
    </SortSectionWrapper>
  )
}

export default GroupByMenu
