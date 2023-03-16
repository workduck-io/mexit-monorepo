import { useMemo, useState } from 'react'

import { MIcon, useDataStore } from '@mexit/core'
import { DefaultMIcons, GenericFlex, Group, IconDisplay, Menu, MenuItem } from '@mexit/shared'

import { MoveSpaceSection } from './styled'

export type SelectedOption = { id: string; label: string; icon: MIcon }

type MoveToSpaceProps = {
  selected?: SelectedOption
  currentSpaceId?: string
  onChange: (option: SelectedOption) => void
}

const MoveToSpace: React.FC<MoveToSpaceProps> = ({ selected, onChange, currentSpaceId }) => {
  const [isSelectorVisible, setIsSelectorVisible] = useState(false)

  /**
   * Namspaces where user can move Notes before deleting Space.
   */
  const namespaces = useDataStore((store) =>
    store.namespaces.filter((space) => space.access === 'OWNER' && currentSpaceId !== space.id)
  )

  const namespaceOptions = useMemo(
    () =>
      namespaces.map((space) => ({
        id: space.id,
        label: space.name,
        icon: space.icon
      })),
    [namespaces]
  )

  const onMoveToSpaceSelect = (e) => {
    e.stopPropagation()
    setIsSelectorVisible((s) => !s)
    onChange(undefined)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.stopPropagation()
  }

  return (
    <MoveSpaceSection>
      <Group>
        <input type="checkbox" checked={isSelectorVisible} onChange={onMoveToSpaceSelect} />
        Move Notes to Another Space
      </Group>
      {isSelectorVisible && (
        <Menu
          key="wd-mexit-space-selector"
          border
          handleKeyDown={handleKeyDown}
          values={
            <GenericFlex>
              <IconDisplay icon={selected?.icon ?? DefaultMIcons.SPACE} />
              {selected?.label ?? 'Select Space'}
            </GenericFlex>
          }
          allowSearch
          searchPlaceholder="Search Space"
        >
          {namespaceOptions.map((op) => {
            return (
              <MenuItem
                key={op.id}
                icon={op.icon ?? DefaultMIcons.SPACE}
                selected={selected?.id === op.id}
                onClick={() => onChange(op)}
                label={op.label}
              />
            )
          })}
        </Menu>
      )}
    </MoveSpaceSection>
  )
}

export default MoveToSpace
