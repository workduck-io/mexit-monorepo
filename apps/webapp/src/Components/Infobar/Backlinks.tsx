import arrowGoBackLine from '@iconify/icons-ri/arrow-go-back-line'
import React from 'react'

import { Note } from '@mexit/shared'
import { InfoWidgetWrapper } from '@mexit/shared'

import { BacklinksHelp, ForwardlinksHelp } from '../../Data/defaultText'
import { useLinks } from '../../Hooks/useLinks'
import Collapse from '../../Layout/Collapse'
import NodeLink from '../Editor/NodeLink'
import { capitalize } from '@mexit/core'

interface BackLinkProps {
  nodeid: string
}

const Backlinks = ({ nodeid }: BackLinkProps) => {
  const { getBacklinks, getForwardlinks } = useLinks()
  const [state, setState] = React.useState<'backlink' | 'forwardlink'>('backlink')
  const backlinks = getBacklinks(nodeid)
  const forwardlinks = getForwardlinks(nodeid)

  const toggleState = () => {
    setState((s) => (s === 'backlink' ? 'forwardlink' : 'backlink'))
  }

  const linksToShow = state === 'backlink' ? backlinks : forwardlinks

  return (
    <InfoWidgetWrapper>
      <Collapse
        maximumHeight="40vh"
        defaultOpen
        icon={`mex:${state}`}
        title={state === 'backlink' ? 'Backlinks' : 'Forwardlinks'}
        onTitleClick={toggleState}
        infoProps={{
          text: state === 'backlink' ? BacklinksHelp : ForwardlinksHelp
        }}
      >
        {linksToShow.length === 0 && (
          <>
            <Note>No {capitalize(state)}s found.</Note>
            <Note>
              Link {state === 'backlink' ? 'this note from other notes' : 'from this note'} to view them here.
            </Note>
          </>
        )}
        {linksToShow.map((l, i) => (
          <NodeLink key={`backforlink_${l.nodeid}_${i}`} keyStr={`backforlink_${l.nodeid}_${i}`} nodeid={l.nodeid} />
        ))}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

export default Backlinks
