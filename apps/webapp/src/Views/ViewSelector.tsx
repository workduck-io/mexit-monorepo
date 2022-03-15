import React from 'react'
import styled from 'styled-components'

import listCheck2 from '@iconify-icons/ri/list-check-2'
import layoutGridFill from '@iconify-icons/ri/layout-grid-fill'
import { Icon } from '@iconify/react'

export enum View {
  List = 'list',
  Card = 'card'
  // NotFound = 'notFound'
}

export const ViewSelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const ViewSelectorButton = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  color: ${({ theme, selected }) => (selected ? theme.colors.text.oppositePrimary : theme.colors.gray[3])};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.gray[8])};

  svg {
    width: 1rem;
    height: 1rem;
    color: ${({ theme, selected }) => (selected ? theme.colors.text.oppositePrimary : theme.colors.primary)};
  }
`

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
