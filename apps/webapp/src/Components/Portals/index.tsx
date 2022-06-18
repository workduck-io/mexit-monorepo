import React, { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import toast from 'react-hot-toast'
import { Icon } from '@iconify/react'

import { mog } from '@mexit/core'

import { useLinks } from '../../Hooks/useLinks'
import usePortalStore from '../../Stores/usePortalStore'
import { usePortals } from '../../Hooks/usePortals'
import { QuickLink } from '../NodeSelect/NodeSelect'

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

  const actionGroup = apps[params.actionGroupId]

  const { connectedPortalInfo, parentNoteName } = useMemo(() => {
    const connectedPortalInfo = getIsPortalConnected(actionGroup.actionGroupId)

    let parentNoteName = ''
    if (connectedPortalInfo) {
      parentNoteName = getPathFromNodeid(connectedPortalInfo?.parentNodeId)
    }

    return {
      parentNoteName,
      connectedPortalInfo
    }
  }, [params.actionGroupId, connectedPortals])

  const isNewPortal = serviceId && !connectedPortalInfo

  const onClick = () => {
    const url = actionGroup?.authConfig?.authURL
    if (url) shell.openExternal(url)
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
        await updateParentNote(params.actionGroupId, connectedPortalInfo.serviceId, parentNote.nodeid)
      } else {
        await connectToPortal(params.actionGroupId, serviceId, parentNote?.nodeid)
      }

      toast(`Updated Successfully! All new notes will be added under "${parentNoteName}"`)
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
          <LoadingButton dots={2} loading={isLoading} buttonProps={{ onClick: onSaveDetails, transparent: true }}>
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
