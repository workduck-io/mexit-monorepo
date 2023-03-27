import React from 'react'

import { withPlateEventProvider } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'

import { BalloonToolbarBase, BalloonToolbarProps, useFloatingToolbar } from '@mexit/shared'

export const BalloonToolbar = withPlateEventProvider((props: BalloonToolbarProps) => {
  const { children, arrow = true, portalElement, floatingOptions } = props

  const { floating, style, open } = useFloatingToolbar({
    floatingOptions
  })

  if (!open) return null

  return (
    <PortalBody element={portalElement}>
      <BalloonToolbarBase ref={floating} style={style}>
        {children}
      </BalloonToolbarBase>
    </PortalBody>
  )
})
