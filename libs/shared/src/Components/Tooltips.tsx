import React from 'react'

import Tippy, { TippyProps } from '@tippyjs/react'

export const NavTooltip = (props: TippyProps) => {
  return <Tippy theme="mex-bright" moveTransition="transform 0.25s ease-out" placement="right" {...props} />
}

export const ToolbarTooltip = (props: TippyProps) => {
  return <Tippy theme="mex-bright" moveTransition="transform 0.25s ease-out" placement="bottom" {...props} />
}
