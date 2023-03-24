import React, { useMemo } from 'react'

import { useHighlightStore } from '@mexit/core'
import { CenteredFlex, DefaultMIcons, getMIcon, List, SnippetCards } from '@mexit/shared'

import { AddTags } from './AddTags'
import { GenericCard } from './GenericCard'
import { HighlightGroups } from './HighlightGroup'
import { ShortenerComponent } from './ShortenerComponent'
import SidebarSection from './SidebarSection'

// TODO: add links to onboarding tutorials later
// and maybe a check if the user doesn't want to see a card again
const basicOnboarding = [
  {
    icon: 'ri:link-m',
    title: 'Shorten URLs and Tag them',
    description: 'Create shortcuts for important URLs and tag them to organize'
  },
  {
    icon: 'ri:edit-2-line',
    title: 'Highlight Content',
    description:
      'Select and open Spotlight to create a highlight and save it in a note. Highlights are shown here in the sidebar'
  },
  {
    icon: 'lucide:highlighter',
    title: 'Use your knowledge everywhere',
    description: 'Use [[ to link to your public notes, use snippets and insert website shortcuts that you have created'
  }
]

export function ContextInfoBar() {
  const highlights = useHighlightStore((state) => state.highlights)
  const getHighlightsOfUrl = useHighlightStore((state) => state.getHighlightsOfUrl)

  const pageHighlights = useMemo(() => {
    return getHighlightsOfUrl(window.location.href)
  }, [window.location, highlights])

  return (
    <SnippetCards fullHeight>
      <SidebarSection label="Shorten URL" icon={getMIcon('ICON', 'ri:link-m')}>
        <ShortenerComponent />
      </SidebarSection>
      <SidebarSection label="Tags" icon={DefaultMIcons.TAG}>
        <AddTags />
      </SidebarSection>
      {pageHighlights?.length > 0 ? (
        <SidebarSection label="Highlights" icon={DefaultMIcons.HIGHLIGHT}>
          <List $noMargin scrollable>
            <HighlightGroups highlights={pageHighlights} />
          </List>
        </SidebarSection>
      ) : (
        <>
          <CenteredFlex>
            <h2>Hi there</h2>
            <p>Let&apos;s get you started</p>
          </CenteredFlex>
          <SnippetCards fullHeight={false}>
            {basicOnboarding.map((item) => (
              <GenericCard icon={item.icon} title={item.title} description={item.description} />
            ))}
          </SnippetCards>
        </>
      )}
    </SnippetCards>
  )
}
