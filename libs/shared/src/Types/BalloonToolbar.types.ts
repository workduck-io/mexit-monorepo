import { ReactNode } from 'react'

import { ToolbarProps } from '@udecode/plate'
import { UseVirtualFloatingOptions } from '@udecode/plate-floating'
import { StyledProps } from '@udecode/plate-styled-components'

export interface BalloonToolbarStyleProps extends BalloonToolbarProps {
  placement?: string
}

export interface BalloonToolbarProps extends StyledProps<ToolbarProps> {
  children: ReactNode

  /**
   * Color theme for the background/foreground.
   */
  theme?: 'dark' | 'light'

  /**
   * Show an arrow pointing to up or down depending on the direction.
   */
  arrow?: boolean

  portalElement?: Element

  floatingOptions?: UseVirtualFloatingOptions
}
