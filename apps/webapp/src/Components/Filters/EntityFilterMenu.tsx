import { useParams } from 'react-router-dom'

import { Entities } from '@workduck-io/mex-search'

import {
  DefaultMIcons,
  GenericSection,
  IconDisplay,
  Menu,
  MenuItem,
  SearchEntities,
  SortSectionWrapper
} from '@mexit/shared'

import { useViewFilterStore } from '../../Hooks/todo/useTodoFilters'

const EntityFilterMenu = ({ onChange }) => {
  const viewId = useParams().viewid
  const entities = useViewFilterStore((store) => store.entities)

  const isSelected = (entity: Entities) => {
    return entities?.includes(entity)
  }

  return (
    <SortSectionWrapper>
      <Menu
        multiSelect
        key={`${viewId}-${entities?.length}`}
        values={
          <GenericSection>
            <IconDisplay icon={DefaultMIcons.TEXT} />
            Type
          </GenericSection>
        }
      >
        {Object.entries(SearchEntities)
          .filter(([key, entity]) => entity.label !== 'Ungrouped')
          .map(([key, entity]) => {
            return (
              <MenuItem
                selected={isSelected(key as Entities)}
                icon={entity.icon}
                multiSelect
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
