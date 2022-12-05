import Dibba from './Components/Dibba'
import { DibbaPortal } from './Components/Dibba/DibbaPortal'
import { InternalEvents } from './Components/InternalEvents'
import ReminderArmer from './Components/ReminderArmer'
import { ExtInfoBar } from './Components/Sidebar'
import Sputlit from './Components/Sputlit'
import { SputlitPortal } from './Components/Sputlit/SputlitPortal'
import Tooltip from './Components/Tooltip'
import { TooltipPortal } from './Components/Tooltip/TooltipPortal'
import { HighlighterProvider } from './Hooks/useHighlighterContext'
import { SputlitProvider } from './Hooks/useSputlitContext'

const Extension = () => {
  return (
    <>
      <ReminderArmer />
      <SputlitProvider>
        <HighlighterProvider>
          <DibbaPortal>
            <Dibba />
          </DibbaPortal>

          <InternalEvents />

          {/* TODO: think of a better name, and use it everywhere for consistency */}
          <ExtInfoBar />

          <TooltipPortal>
            <Tooltip />
          </TooltipPortal>

          <SputlitPortal>
            <Sputlit />
          </SputlitPortal>
        </HighlighterProvider>
      </SputlitProvider>
    </>
  )
}

export default Extension
