import { useEffect, useState } from 'react'
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
import { getTitleFromPath } from '../Hooks/useLinks'
import { usePublicNodeStore } from '../Stores/usePublicNodes'

const PublicEditorWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
`

const PublicNodeView = () => {
  const nodeId = useParams().nodeId
  const { getPublicNodeAPI } = useApi()
  const navigate = useNavigate()
  const [node, setNode] = useState<any>()
  const [showLoader, setShowLoader] = useState(true)
  const [firstVisit, setFirstVisit] = useState<boolean>(true)

  const { getContent, setContent, iLinks, namespace } = usePublicNodeStore()

  useEffect(() => {
    const cookies = new Cookies()
    const timestamp = Date.now()

    const existingCookie = cookies.get('mexit-sharing')

    if (existingCookie) setFirstVisit(false)
    cookies.set('mexit-sharing', timestamp, { path: '/' })
  }, [])

  // TODO: check api store and before making a request again
  // content would be available inside usePublicNodesStore
  useEffect(() => {
    async function getPublicNodeContent() {
      try {
        const node = await getPublicNodeAPI(nodeId)
        // Only checking these for public namespaces view
        // No need for trying this for individual nodes on frontend
        if (!node && window.location.pathname.startsWith('/share/namespace')) {
          const nodeContent = getContent(nodeId)
          const nodeProperties = iLinks.find((item) => item.nodeid === nodeId)
          setNode({ ...nodeContent, title: getTitleFromPath(nodeProperties.path), id: nodeId, metadata: node.metadata })
          // mog('check', { nodeContent, nodeProperties })
        } else {
          setShowLoader(true)
          setNode({ ...node, id: nodeId, metadata: node.metadata })
          setContent(node.id, node.content, node?.metadata)
          setShowLoader(false)
        }
      } catch (error) {
        mog('ErrorOccuredWhenFetchingPublicNode', { error })
        navigate('/404')
      }
    }
    getPublicNodeContent()
  }, [nodeId])

  useEffect(() => {
    document.title = node?.title
      ? namespace
        ? `Mexit - ${namespace.name} | ${node.title}`
        : `Mexit - ${node.title}`
      : document.title
  }, [node?.title, namespace])

  return (
    <PublicEditorWrapper>
      {showLoader && node ? (
        <SplashScreen />
      ) : (
        <>
          <PublicNodeEditor nodeId={nodeId} node={node} namespaceId={namespace} />
          <PublicDataInfobar nodeId={nodeId} content={node?.content ?? defaultContent.content} />
          <PublicNodeFloatingButton firstVisit={firstVisit} />
        </>
      )}
    </PublicEditorWrapper>
  )
}

export default PublicNodeView
