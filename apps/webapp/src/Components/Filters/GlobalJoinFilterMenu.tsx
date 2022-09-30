import React from 'react'

import { GlobalFilterJoin } from '@mexit/core'

import { getFilterJoinIcon } from '../../Hooks/useFilterValueIcons'
import { Menu, MenuItem } from '../FloatingElements/Dropdown'
import IconDisplay from '../IconPicker/IconDisplay'
import { FilterGlobalJoinWrapper, GenericSection } from './Filter.style'

interface GlobalJoinFilterMenuProps {
  globalJoin: GlobalFilterJoin
  setGlobalJoin: (join: GlobalFilterJoin) => void
}

const GlobalJoinFilterMenu = ({ globalJoin, setGlobalJoin }: GlobalJoinFilterMenuProps) => {
  return (
    <FilterGlobalJoinWrapper>
      <Menu
        values={
          <GenericSection>
            <IconDisplay icon={getFilterJoinIcon(globalJoin)} />
            {globalJoin === 'any' ? 'Any' : 'All'} filters
          </GenericSection>
        }
      >
        <MenuItem icon={getFilterJoinIcon('all')} onClick={() => setGlobalJoin('all')} label={'All'} />
        <MenuItem icon={getFilterJoinIcon('any')} onClick={() => setGlobalJoin('any')} label={'Any'} />
      </Menu>
    </FilterGlobalJoinWrapper>
  )
}

export const RenderGlobalJoin = ({ globalJoin }: { globalJoin: GlobalFilterJoin }) => {
  return (
    <FilterGlobalJoinWrapper>
      <GenericSection>
        <IconDisplay icon={getFilterJoinIcon(globalJoin)} />
        {globalJoin === 'any' ? 'Any' : 'All'} filters
      </GenericSection>
    </FilterGlobalJoinWrapper>
  )
}

export default GlobalJoinFilterMenu
