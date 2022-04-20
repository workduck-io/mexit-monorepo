import React from 'react'
import { ILinkElementProps, QuickLinkElement } from '@workduck-io/mex-editor'
import { mog } from '@mexit/core'

const ILinkWrapper = (props: ILinkElementProps) => {
  // * TBD: Uncomment after adding stores
  // const { push } = useNavigation()
  // const { getNodeidFromPath } = useLinks()

  // const nodeid = getNodeidFromPath(props.element.value)
  // const { archived } = useArchive()

  const nodeId = 'random'

  const handleILinkClick = () => {
    mog('Clicked on ILink', {})
    // * push(nodeid)
  }

  return <QuickLinkElement {...props} onClick={handleILinkClick} isArchived nodeId={nodeId} acrhivedIcon="something" />
}

export default ILinkWrapper
