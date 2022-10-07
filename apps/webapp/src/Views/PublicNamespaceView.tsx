import React, { useEffect, useState } from 'react'

import { useParams, useNavigate, Outlet } from 'react-router-dom'

import { mog } from '@mexit/core'

import { PublicNoteSidebar } from '../Components/Sidebar/PublicSidebar.notes'
import { SidebarSpace } from '../Components/Sidebar/Sidebar.types'
import SplashScreen from '../Components/SplashScreen'
import { useApi } from '../Hooks/API/useNodeAPI'
import { usePublicNodeStore } from '../Stores/usePublicNodes'

function PublicNamespaceView() {
  const [showLoader, setShowLoader] = useState(true)
  const { setNamespace, setILinks } = usePublicNodeStore()
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

        setILinks(response.nodeHierarchy)
        navigate(`node/${response.nodeHierarchy[0]?.nodeid}`)

        mog('namespace', { response })
        setTimeout(() => {
          setShowLoader(false)
        }, 1000)
      } catch (error) {
        mog('ErrorOccuredWhenFetchingPublicNamespace', { error })
        // navigate('/404', { replace: false })
      }
    }

    getPublicNamespace()
  }, [])

  return (
    <div>
      {showLoader ? (
        <SplashScreen />
      ) : (
        <div>
          {/* <PublicNoteSidebar /> */}
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default PublicNamespaceView
