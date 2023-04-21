import React from 'react'
import { createPortal } from 'react-dom'

import { useAuthStore } from '@mexit/core'

import AIPreviewContainer from './Components/AIPreview'
import Dibba from './Components/Dibba'
import { DibbaPortal } from './Components/Dibba/DibbaPortal'
import { InternalEvents } from './Components/InternalEvents'
import PageBallonToolbar from './Components/PageBalloonToolbar'
import ReminderArmer from './Components/ReminderArmer'
import { ExtInfoBar } from './Components/Sidebar'
import Sputlit from './Components/Sputlit'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import Tooltip from './Components/Tooltip'
import { TooltipPortal } from './Components/Tooltip/TooltipPortal'
import { HighlighterProvider } from './Hooks/useHighlighterContext'
import { SputlitProvider } from './Hooks/useSputlitContext'
import { styleSlot } from './Utils/cs-utils'

interface Props {
  children: React.ReactNode
}

export function PortalMaker(props: Props) {
  return createPortal(props.children, styleSlot)
}

const Extension = () => {
  const authenticated = useAuthStore((a) => a.authenticated)
  return (
    <>
      {authenticated && <ReminderArmer />}
      <SputlitProvider>
        <HighlighterProvider>
          {authenticated && (
            <>
              <DibbaPortal>
                <Dibba />
              </DibbaPortal>
              <InternalEvents />
              <TooltipPortal>
                <Tooltip />
              </TooltipPortal>
              <PortalMaker>
                <AIPreviewContainer />
              </PortalMaker>
              <PageBallonToolbar />
            </>
          )}
          <ExtInfoBar />
          <SputlitPortal>
            <Sputlit />
          </SputlitPortal>
        </HighlighterProvider>
      </SputlitProvider>
    </>
  )
}

export default Extension
