import React from 'react'

import { getFavicon, getMIcon, mog, useLinkStore } from '@mexit/core'

import SidebarList from './SidebarList'

type CaptureListProps = {
  type: 'capture' | 'link'
}

const CaptureList: React.FC<CaptureListProps> = ({ type }) => {
  const captures = useLinkStore((store) => store.links)

  const onOpenLink = (url: string) => {
    mog('Opening link', { url })
    if (url) {
      window.open(url, '_blank')
    }
  }

  const sortedCaptures = React.useMemo(() => {
    return captures.map((capture) => ({
      id: capture?.url,
      label: capture?.title,
      icon: getMIcon('URL', getFavicon(capture?.url)),

      data: capture
    }))
  }, [captures])

  return (
    <>
      <SidebarList items={sortedCaptures} onClick={onOpenLink} />
    </>
  )
}

export default CaptureList
