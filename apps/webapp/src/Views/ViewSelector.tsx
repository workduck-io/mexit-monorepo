import React from 'react'

import { Icon } from '@iconify/react'
import layoutGridFill from '@iconify-icons/ri/layout-grid-fill'
import listCheck2 from '@iconify-icons/ri/list-check-2'

import { View, ViewSelectorButton, ViewSelectorWrapper } from '@mexit/shared'

interface ViewSelectorProps {
  onChangeView: (view: View) => void
  availableViews?: View[]
  currentView: View
}

const defaultEntries = [View.List, View.Card]

const ViewSelector = ({ onChangeView, availableViews = defaultEntries, currentView }: ViewSelectorProps) => {
  // mog('ViewSelector', {
  //   currentView,
  //   entries: Object.entries(View),
  //   availableViews,
  //   entriesAvailable: Object.entries(availableViews)
  // })

  return (
    <ViewSelectorWrapper>
      {availableViews.map((view) => (
        <ViewSelectorButton
          selected={currentView === view}
          key={`ViewSelectButton_${view}`}
          onClick={() => onChangeView(view)}
        >
          <Icon width={24} height={24} icon={view === View.List ? listCheck2 : layoutGridFill} />
        </ViewSelectorButton>
      ))}
    </ViewSelectorWrapper>
  )
}

export default ViewSelector
