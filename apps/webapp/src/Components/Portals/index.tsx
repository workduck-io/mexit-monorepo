import React, { useMemo } from 'react'

import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import { useLocation, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'

import { LoadingButton } from '@workduck-io/mex-components'

import { mog } from '@mexit/core'

import { useLinks } from '../../Hooks/useLinks'
import { usePortals } from '../../Hooks/usePortals'
import usePortalStore from '../../Stores/usePortalStore'
import { GlobalSectionHeader, GlobalSectionContainer } from '../../Style/GlobalSection'
import { QuickLink } from '../NodeSelect/NodeSelect'
import CreateInput from '../createInput'
import ServiceHeader from './ServiceHeader'
import ServiceInfo from './ServiceInfo'
import { useNamespaces } from '../../Hooks/useNamespaces'

const Portals = () => {
  const theme = useTheme()
  const params = useParams()
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const serviceId = query.get('serviceId')

  const [isEdit, setIsEdit] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [parentNote, setParentNote] = React.useState<QuickLink>(undefined)

  const { getPathFromNodeid } = useLinks()
  const { connectToPortal, updateParentNote } = usePortals()

  const apps = usePortalStore((store) => store.apps)
  const connectedPortals = usePortalStore((store) => store.connectedPortals)
  const getIsPortalConnected = usePortalStore((store) => store.getIsPortalConnected)
  const { getNamespaceOfNodeid } = useNamespaces()

  const actionGroup = apps[params.actionGroupId]

  mog('Inside Specific Portal', { location, query, serviceId, apps, connectedPortals, params, actionGroup })

  const { connectedPortalInfo, parentNoteName } = useMemo(() => {
    const connectedPortalInfo = getIsPortalConnected(actionGroup.actionGroupId)

    let parentNoteName = undefined
    if (connectedPortalInfo) {
      const namespace = getNamespaceOfNodeid(connectedPortalInfo?.parentNodeId)
      parentNoteName = {
        path: getPathFromNodeid(connectedPortalInfo?.parentNodeId),
        namespace: namespace?.id
      }
    }

    return {
      parentNoteName,
      connectedPortalInfo
    }
  }, [params.actionGroupId, connectedPortals])

  const isNewPortal = serviceId && !connectedPortalInfo

  const onClick = () => {
    const url = actionGroup?.authConfig?.authURL

    if (url) window.open(url, '_blank')
  }

  const onSaveDetails = async () => {
    if (!isEdit && !isNewPortal) {
      setIsEdit(true)
      return
    }

    if (!parentNote && !connectedPortalInfo) {
      toast('Select a Note first')
      return
    }

    try {
      setIsLoading(true)
      const isUpdate = connectedPortalInfo && connectedPortalInfo.parentNodeId !== parentNote?.nodeid

      if (isUpdate) {
        await updateParentNote(
          params.actionGroupId,
          connectedPortalInfo.serviceId,
          parentNote.nodeid,
          parentNote?.namespace
        )
        toast(`Updated Successfully! All new notes will be added under "${parentNote.text}"`)
      } else {
        await connectToPortal(params.actionGroupId, serviceId, parentNote?.nodeid, parentNote?.namespace)
        toast(`Updated Successfully! All new notes will be added under "${parentNoteName}"`)
      }
    } catch (err) {
      mog('Error connecting to portal', { err })
    } finally {
      setIsLoading(false)
      setIsEdit(false)
    }
  }

  const onNodeChange = (note: QuickLink) => {
    setParentNote(note)
  }

  return (
    <ServiceInfo>
      <ServiceHeader
        description={actionGroup.description}
        icon={actionGroup.icon}
        isConnected={!!connectedPortalInfo}
        title={actionGroup.name}
        onClick={onClick}
      />
      {(isNewPortal || connectedPortalInfo) && (
        <GlobalSectionContainer>
          <div>Select a Parent Note</div>
          <GlobalSectionHeader>
            <CreateInput
              value={parentNoteName}
              autoFocus={isNewPortal || isEdit}
              disabled={!isNewPortal && !isEdit}
              onChange={onNodeChange}
            />
          </GlobalSectionHeader>
          <LoadingButton dots={2} loading={isLoading} onClick={onSaveDetails} transparent>
            <Icon
              color={theme.colors.primary}
              width={24}
              icon={isEdit || isNewPortal ? 'teenyicons:tick-circle-outline' : 'clarity:note-edit-line'}
            />
          </LoadingButton>
        </GlobalSectionContainer>
      )}
    </ServiceInfo>
  )
}

export default Portals
