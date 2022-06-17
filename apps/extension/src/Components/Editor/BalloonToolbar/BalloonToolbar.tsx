import { withPlateProvider } from '@udecode/plate-core'
import { PortalBody } from '@udecode/plate-styled-components'
import { UsePopperPositionOptions } from '@udecode/plate-ui-popper'
import React, { useRef } from 'react'
// import { ToolbarBase } from '../Toolbar/Toolbar'
import { BalloonToolbarBase, getBalloonToolbarStyles } from '@mexit/shared'
import { BalloonToolbarProps } from '@mexit/shared'
import { useBalloonToolbarPopper } from './useBalloonToolbarPopper'

export const BalloonToolbar = withPlateProvider((props: BalloonToolbarProps) => {
  const { children, theme = 'dark', arrow = false, portalElement, popperOptions: _popperOptions = {} } = props

  const popperRef = useRef<HTMLDivElement>(null)

  const popperOptions: UsePopperPositionOptions = {
    popperElement: popperRef.current,
    placement: 'top' as any,
    // TODO: not able to fix the position on the balloon toolbar, approximation for now
    offset: [window.innerWidth / 3.5, window.innerHeight / 5.5],
    ..._popperOptions
  }

  const { styles: popperStyles, attributes } = useBalloonToolbarPopper(popperOptions)

  const styles = getBalloonToolbarStyles({
    popperOptions,
    theme,
    arrow,
    ...props
  })

  return (
    <PortalBody element={portalElement}>
      <BalloonToolbarBase
        ref={popperRef}
        className={styles.root.className}
        style={popperStyles.popper}
        popperOptions={popperOptions}
        {...attributes.popper}
      >
        {children}
      </BalloonToolbarBase>
    </PortalBody>
  )
})
