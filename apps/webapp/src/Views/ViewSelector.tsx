import React from 'react'
import styled from 'styled-components'

import listCheck2 from '@iconify-icons/ri/list-check-2'
import layoutGridFill from '@iconify-icons/ri/layout-grid-fill'
import { Icon } from '@iconify/react'
import { View, ViewSelectorButton, ViewSelectorWrapper } from '@mexit/shared'

const ViewSelector = ({ onChangeView, currentView }: { onChangeView: (view: View) => void; currentView: View }) => {
  // mog('ViewSelector', { currentView, entries: Object.entries(View) })
  return (
    <ViewSelectorWrapper>
      <div>View: </div>

      {Object.entries(View).map(([view, val]) => (
        <ViewSelectorButton
          selected={currentView === val}
          key={`ViewSelectButton_${view}`}
          onClick={() => onChangeView(View[view])}
        >
          <Icon icon={val === View.List ? listCheck2 : layoutGridFill} />
          {view}
        </ViewSelectorButton>
      ))}
    </ViewSelectorWrapper>
  )
}

export default ViewSelector
