import { useEffect, useState } from 'react'

import { useParams, useNavigate, Outlet } from 'react-router-dom'

import { mog } from '@mexit/core'

import SplashScreen from '../Components/SplashScreen'
import { useApi } from '../Hooks/API/useNodeAPI'
import { usePublicNodeStore } from '../Stores/usePublicNodes'

function PublicNamespaceView() {
  const [showLoader, setShowLoader] = useState(true)
  const { setNamespace, setILinks, setCurrentNode } = usePublicNodeStore()
  const namespaceID = useParams().namespaceID
  const navigate = useNavigate()
  const { getPublicNamespaceAPI } = useApi()

  useEffect(() => {
    async function getPublicNamespace() {
      try {
        const response: any = await getPublicNamespaceAPI(namespaceID)

        setNamespace({
          id: response.id,
          name: response.name,
          icon: response.metadata?.icon,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        })

        const firstNode = response.nodeHierarchy[0]

        setILinks(response.nodeHierarchy)
        navigate(`node/${firstNode.nodeid}`)
        setCurrentNode(firstNode)

        setTimeout(() => {
          setShowLoader(false)
        }, 1000)
      } catch (error) {
        mog('ErrorOccuredWhenFetchingPublicNamespace', { error })
        navigate('/404', { replace: false })
      }
    }

    getPublicNamespace()
  }, [])

  return showLoader ? <SplashScreen /> : <Outlet />
}

export default PublicNamespaceView
