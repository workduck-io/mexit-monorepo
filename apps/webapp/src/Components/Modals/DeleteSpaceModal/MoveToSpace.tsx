import { useMemo, useState } from 'react'

import { MIcon } from '@mexit/core'
import { DefaultMIcons, GenericFlex, Group, IconDisplay, Menu, MenuItem } from '@mexit/shared'

import { useDataStore } from '../../../Stores/useDataStore'

import { MoveSpaceSection } from './styled'

export type SelectedOption = { id: string; label: string; icon: MIcon }

type MoveToSpaceProps = {
  selected?: SelectedOption
  onChange: (option: SelectedOption) => void
}

const MoveToSpace: React.FC<MoveToSpaceProps> = ({ selected, onChange }) => {
  const [isSelectorVisible, setIsSelectorVisible] = useState(false)

  /**
   * Namspaces where user can move Notes before deleting Space.
   */
  const namespaces = useDataStore((store) => store.namespaces.filter((space) => space.access === 'OWNER'))

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
