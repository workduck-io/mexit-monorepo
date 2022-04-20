import React from 'react'
import arrowGoBackLine from '@iconify/icons-ri/arrow-go-back-line'

import { Note } from '@mexit/shared'

import { BacklinksHelp } from '../../Data/defaultText'
import { useLinks } from '../../Hooks/useLinks'
import NodeLink from '../Editor/NodeLink'
import Collapse from '../../Layout/Collapse'

import { InfoWidgetWrapper } from '../../Style/Infobar'

interface BackLinkProps {
  nodeid: string
}

const Backlinks = ({ nodeid }: BackLinkProps) => {
  const { getBacklinks } = useLinks()
  const backlinks = getBacklinks(nodeid)

  return (
    <InfoWidgetWrapper>
      <Collapse
        maximumHeight="40vh"
        defaultOpen
        icon={arrowGoBackLine}
        title="Backlinks"
        infoProps={{
          text: BacklinksHelp
        }}
      >
        {backlinks.length === 0 && (
          <>
            <Note>No backlinks found.</Note>
            <Note>Link from other nodes to view them here.</Note>
          </>
        )}
        {backlinks.map((l, i) => (
          <NodeLink key={`backlink_${l.nodeid}_${i}`} keyStr={`backlink_${l.nodeid}_${i}`} nodeid={l.nodeid} />
        ))}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

export default Backlinks
