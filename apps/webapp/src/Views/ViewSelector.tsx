import React from 'react'

import { Icon } from '@iconify/react'
import layoutGridFill from '@iconify-icons/ri/layout-grid-fill'
import listCheck2 from '@iconify-icons/ri/list-check-2'

import { ViewSelectorButton, ViewSelectorWrapper,ViewType } from '@mexit/shared'

export interface ViewSelectorProps {
  onChangeView: (view: ViewType) => void
  availableViews?: ViewType[]
  currentView: ViewType
}

const defaultEntries = [ViewType.List, ViewType.Card]

const viewIcons = {
  [ViewType.List]: listCheck2,
  [ViewType.Card]: layoutGridFill,
  [ViewType.Kanban]: 'ph:kanban'
}

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
          <Icon width={24} height={24} icon={viewIcons[view]} />
        </ViewSelectorButton>
      ))}
    </ViewSelectorWrapper>
  )
}

export default ViewSelector
