import { useParams } from 'react-router-dom'

import { SuperBlocks } from '@mexit/core'
import {
  DefaultMIcons,
  EntitiesInfo,
  FilterDescription,
  IconDisplay,
  Menu,
  MenuItem,
  SearchableEntities,
  SmallGap,
  SortSectionWrapper
} from '@mexit/shared'

import { useViewFilterStore } from '../../Hooks/todo/useTodoFilters'

const EntityFilterMenu = ({ onChange }) => {
  const viewId = useParams().viewid
  const entities = useViewFilterStore((store) => store.entities)

  const isSelected = (entity: SuperBlocks) => {
    return entities?.includes(entity)
  }

  return (
    <SortSectionWrapper>
      <Menu
        border
        noHover
        multiSelect
        key={`${JSON.stringify(entities)}-${viewId}`}
        values={
          <SmallGap>
            <IconDisplay icon={DefaultMIcons.SELECT} />
            Types
          </SmallGap>
        }
      >
        <FilterDescription>Types</FilterDescription>
        {SearchableEntities.map((key) => {
          const entity = EntitiesInfo[key]

          return (
            <MenuItem
              selected={isSelected(key as any)}
              icon={entity.icon}
              multiSelect
              key={`${viewId}-${entity.id}`}
              disabled={viewId === entity.id}
              onClick={() => onChange(key)}
              label={entity.label}
            />
          )
        })}
      </Menu>
    </SortSectionWrapper>
  )
}

export default EntityFilterMenu
