import React from 'react'
import { ILinkElementProps, QuickLinkElement, mog } from '@workduck-io/mex-editor'

const ILinkWrapper = (props: ILinkElementProps) => {
  // * TBD: Uncomment after adding stores
  // const { push } = useNavigation()
  // const { getUidFromNodeId } = useLinks()

  // const nodeid = getUidFromNodeId(props.element.value)
  // const { archived } = useArchive()

  const nodeId = 'random'

  const handleILinkClick = () => {
    mog('Clicked on ILink', {})
    // * push(nodeid)
  }

  return <QuickLinkElement {...props} onClick={handleILinkClick} isArchived nodeId={nodeId} acrhivedIcon="something" />
}

export default ILinkWrapper
