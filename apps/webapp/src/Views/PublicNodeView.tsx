import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Cookies from 'universal-cookie'

import { mog } from '@mexit/core'

import PublicNodeEditor from '../Components/Editor/PublicNodeEditor'
import PublicDataInfobar from '../Components/Infobar/PublicNodeInfobar'
import PublicNodeFloatingButton from '../Components/PublicNodeFloatingButton'
import SplashScreen from '../Components/SplashScreen'
import { defaultContent } from '../Data/baseData'
import { useApi } from '../Hooks/API/useNodeAPI'
import { usePublicNodeStore, PublicNode } from '../Stores/usePublicNodes'

const PublicEditorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const PublicNodeView = () => {
  const nodeId = useParams().nodeId
  const getPublicNode = usePublicNodeStore((store) => store.getPublicNode)
  const { getPublicNodeAPI } = useApi()
  const navigate = useNavigate()
  const [node, setNode] = useState<PublicNode>(getPublicNode(nodeId))
  const [showLoader, setShowLoader] = useState(true)
  const [firstVisit, setFirstVisit] = useState<boolean>(true)

  useEffect(() => {
    const cookies = new Cookies()
    const timestamp = Date.now()

    const existingCookie = cookies.get('mexit-sharing')

    if (existingCookie) setFirstVisit(false)
    cookies.set('mexit-sharing', timestamp, { path: '/' })
  }, [])

  useEffect(() => {
    async function getPublicNodeContent() {
      try {
        const node = await getPublicNodeAPI(nodeId)
        setNode({ ...node, id: nodeId })
        setShowLoader(false)
      } catch (error) {
        mog('ErrorOccuredWhenFetchingPublicNode', { error })
        navigate('/404')
      }
    }
    getPublicNodeContent()
  }, [])

  return (
    <PublicEditorWrapper>
      {showLoader ? (
        <SplashScreen />
      ) : (
        <>
          <PublicNodeEditor nodeId={nodeId} node={node} />
          <PublicDataInfobar nodeId={nodeId} content={node?.content ?? defaultContent.content} />
          <PublicNodeFloatingButton firstVisit={firstVisit} />
        </>
      )}
    </PublicEditorWrapper>
  )
}

export default PublicNodeView
