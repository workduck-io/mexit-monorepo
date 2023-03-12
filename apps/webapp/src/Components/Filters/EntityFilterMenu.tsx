import {
  DefaultMIcons,
  GenericSection,
  IconDisplay,
  Menu,
  MenuItem,
  SearchEntities,
  SortSectionWrapper
} from '@mexit/shared'

const EntityFilterMenu = ({ entities = [], onChange }) => {
  return (
    <SortSectionWrapper>
      <Menu
        multiSelect
        values={
          <GenericSection>
            <IconDisplay icon={DefaultMIcons.TEMPLATE} />
            Type
          </GenericSection>
        }
      >
        {Object.entries(SearchEntities)
          .filter(([key, entity]) => entity.label !== 'Ungrouped')
          .map(([key, entity]) => (
            <MenuItem
              selected={entities.includes(key)}
              icon={entity.icon}
              multiSelect
              key={key}
              onClick={() => onChange(key)}
              label={entity.label}
            />
          ))}
      </Menu>
    </SortSectionWrapper>
  )
}

export default EntityFilterMenu
