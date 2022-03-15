import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PublicNodeEditor from '../Components/Editor/PublicNodeEditor'
import PublicNavbar from '../Components/PublicNavbar'
import Cookies from 'universal-cookie'

const PublicNodeView = () => {
  const nodeId = useParams().nodeId

  useEffect(() => {
    const cookies = new Cookies()
    const timestamp = Date.now()
    cookies.set('mexit-sharing', timestamp, { path: '/' })
  })

  return (
    <>
      <PublicNavbar />
      <PublicNodeEditor nodeId={nodeId} />
    </>
  )
}

export default PublicNodeView
