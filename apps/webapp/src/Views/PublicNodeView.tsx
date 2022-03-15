import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PublicNodeEditor from '../Components/Editor/PublicNodeEditor'
import PublicNavbar from '../Components/PublicNavbar'

const PublicNodeView = () => {
  const nodeId = useParams().nodeId

  return (
    <>
      <PublicNavbar />
      <PublicNodeEditor nodeId={nodeId} />
    </>
  )
}

export default PublicNodeView
