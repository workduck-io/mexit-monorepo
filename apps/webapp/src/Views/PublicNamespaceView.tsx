import { useEffect, useState } from 'react'
import { Outlet,useNavigate, useParams } from 'react-router-dom'

import { mog } from '@mexit/core'

import SplashScreen from '../Components/SplashScreen'
import { useNamespaceApi } from '../Hooks/API/useNamespaceAPI'
// import { useApi } from '../Hooks/API/useNodeAPI'
import { usePublicNodeStore } from '../Stores/usePublicNodes'

function PublicNamespaceView() {
  const [showLoader, setShowLoader] = useState(true)
  const { setNamespace, setILinks, setCurrentNode } = usePublicNodeStore()
  const namespaceID = useParams().namespaceID
  const noteID = useParams().nodeId
  const navigate = useNavigate()
  const { getPublicNamespaceAPI } = useNamespaceApi()

  useEffect(() => {
    async function getPublicNamespace() {
      try {
        const response: any = await getPublicNamespaceAPI(namespaceID)

        setNamespace({
          id: response.id,
          name: response.name,
          access: 'READ', // Set read for public namespaces
          icon: response.metadata?.icon,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        })

        // Use noteID in path params if found, otherwise open the first note in hierarchy
        const firstNode = noteID
          ? response.nodeHierarchy.find((node: any) => node.nodeid === noteID) ?? response.nodeHierarchy[0]
          : response.nodeHierarchy[0]

        // mog('firstNode', { firstNode, noteID })

        setILinks(response.nodeHierarchy)
        navigate(`node/${firstNode.nodeid}`)
        setCurrentNode(firstNode)
        document.title = `Mexit - ${response.name}`
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
