import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import PublicNodeEditor from '../Components/Editor/PublicNodeEditor'
import Cookies from 'universal-cookie'

const PublicNodeView = () => {
  const nodeId = useParams().nodeId
  console.log('Inside public node: ', nodeId)
  useEffect(() => {
    const cookies = new Cookies()
    const timestamp = Date.now()
    cookies.set('mexit-sharing', timestamp, { path: '/' })
  })

  return (
    <>
      <h1>
        <Link to={'/'}>Mexit</Link>
      </h1>
      <PublicNodeEditor nodeId={nodeId} />
    </>
  )
}

export default PublicNodeView
