import circleOutline from '@iconify-icons/codicon/circle-outline'
import React from 'react'

import MexIcons, { MexNodeIcons } from '../Icons/Icons'
import { SIcon } from '../../Style/Sidebar'
import TreeNode from '../../Types/Tree'

interface RCIconProps {
  data: TreeNode
  expanded: boolean
}

// eslint-disable-next-line
const getIcon = (collapsed: boolean, array: [object, object]): object => {
  return collapsed ? array[0] : array[1]
}

const TreeExpandIcon = (props: RCIconProps) => {
  // mog('TreeExpandIcon', { props })
  const { data, expanded } = props
  const canCollapse = data.children.length > 0
  const collapsed = canCollapse && !expanded
  const customIcon = data.mex_icon
  const defaultIcon = circleOutline

  const collapsedIndicatorIcon = MexIcons.openClose

  const collapsedIcon = canCollapse ? getIcon(collapsed, collapsedIndicatorIcon) : defaultIcon

  const icon = customIcon ? getIcon(collapsed, MexNodeIcons[customIcon as string]) : collapsedIcon

  return <SIcon icon={icon} width="16px" height="16px" />
}

export default TreeExpandIcon
