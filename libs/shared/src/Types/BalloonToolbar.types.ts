import { ReactNode } from 'react'
import { StyledProps } from '@udecode/plate-styled-components'
import { UsePopperPositionOptions } from '@udecode/plate-ui-popper'
import { ToolbarProps } from '@udecode/plate'
// import { ToolbarProps } from '../Toolbar/Toolbar.types';

export type BalloonToolbarStyleProps = BalloonToolbarProps

export interface BalloonToolbarStyling {
  popperOptions?: Partial<UsePopperPositionOptions>

  /**
   * Show an arrow pointing to up or down depending on the direction.
   */
  arrow?: boolean
}

export interface BalloonToolbarProps extends StyledProps<ToolbarProps>, BalloonToolbarStyling {
  children: ReactNode
  /**
   * Color theme for the background/foreground.
   */
  theme?: 'dark' | 'light'

  portalElement?: Element
}
