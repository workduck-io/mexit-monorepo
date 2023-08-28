import React from 'react'

import { Icon } from '@iconify/react'
import arrowGoBackLine from '@iconify-icons/ri/arrow-go-back-line'

import { InfoWidgetScroll, InfoWidgetWrapper, Note, useLinks } from '@mexit/shared'

import { DataInfoHeader } from '../../Style/Backlinks'
import NodeLink from '../Editor/NodeLink'

interface BackLinkProps {
  nodeid: string
}
const Backlinks = ({ nodeid }: BackLinkProps) => {
  const { getBacklinks } = useLinks()
  const backlinks = getBacklinks(nodeid)

  return (
    <InfoWidgetWrapper>
      <DataInfoHeader>
        <Icon icon={arrowGoBackLine}></Icon>
        Backlinks
      </DataInfoHeader>
      <InfoWidgetScroll>
        {backlinks.length === 0 && (
          <>
            <Note>No backlinks found.</Note>
            <Note>Link from other nodes to view them here.</Note>
          </>
        )}
        {backlinks.map((l, i) => (
          <NodeLink key={`backlink_${l.nodeid}_${i}`} keyStr={`backlink_${l.nodeid}_${i}`} nodeid={l.nodeid} />
        ))}
      </InfoWidgetScroll>
    </InfoWidgetWrapper>
  )
}

export default Backlinks
