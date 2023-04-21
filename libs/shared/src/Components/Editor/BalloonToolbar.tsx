import React from 'react'

import { withPlateEventProvider } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'

import { useFloatingToolbar } from '../../Hooks/useBalloonToolbarPopper'
import { BalloonToolbarBase } from '../../Style/BalloonToolbar.styles'
import { BalloonToolbarProps } from '../../Types/BalloonToolbar.types'

export const BalloonToolbar = withPlateEventProvider((props: BalloonToolbarProps) => {
  const { children, editor, portalElement, floatingOptions } = props

  const { floating, style, open } = useFloatingToolbar({
    floatingOptions,
    editor
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
