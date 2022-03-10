import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PublicNodeEditor from '../Components/PublicNodeEditor'

const PublicNode = () => {
  const nodeId = useParams().nodeId

  return <PublicNodeEditor nodeId={nodeId} />
}

export default PublicNode
