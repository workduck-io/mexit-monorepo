import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { CenteredColumn, LoadingButton, NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'

import { API, useAuthStore, Workspace } from '@mexit/core'
import { Group, IconDisplay, Loading, Title, WDLogo } from '@mexit/shared'

import Input from '../../Components/Input'
import { ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import { JoinContainer, Page, PageHeader } from './styled'

const JoinWorkspace = () => {
  const [join, setJoin] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace | undefined>()
  const addWorkspace = useAuthStore((store) => store.addWorkspace)
  const activeWorkspace = useAuthStore((store) => store.workspaceDetails)
  const setActiveWorkspace = useAuthStore((store) => store.setActiveWorkspace)

  const { useQuery } = useRouting()

  const query = useQuery()

  useEffect(() => {
    const code = query.get('invite')

    async function getWorkspaceDetails(inviteCode: string) {
      const res = await API.invite.get(inviteCode)

      if (res.workspaceId) {
        const isUserInWorkspace = useAuthStore.getState().workspaces.find((w) => w.id === res.workspaceId)

        if (isUserInWorkspace) {
          setJoin(false)
          setWorkspaceDetails(isUserInWorkspace)
        }
      }

      setLoading(false)
    }

    getWorkspaceDetails(code)

    return () => setJoin(true)
  }, [])

  const handleOnShow = () => {
    //
  }

  const handleJoinWorkspace = async () => {
    const code = query.get('invite')
    if (code) API.user.addExistingUserToWorkspace(code)
  }

  return (
    <Page>
      <PageHeader>
        <NavTooltip content={<TitleWithShortcut title="Home" />}>
          <NavLink to={ROUTE_PATHS.home}>
            <WDLogo height={'40'} width={'40'} />
          </NavLink>
        </NavTooltip>
      </PageHeader>
      <CenteredColumn>
        {loading ? (
          <Loading dots={5} />
        ) : (
          <>
            {workspaceDetails && (
              <Group>
                <IconDisplay icon={workspaceDetails?.icon} size={32} />
                <h3>{workspaceDetails?.name}</h3>
              </Group>
            )}
            {join ? (
              <JoinContainer>
                <Title>Join Workspace</Title>
                <Input
                  name="invite"
                  inputProps={{
                    placeholder: 'Enter Invite Code...'
                  }}
                  transparent
                />
                <LoadingButton onClick={handleJoinWorkspace}>Join</LoadingButton>
              </JoinContainer>
            ) : (
              <JoinContainer>
                <Title>You&apos;ve joined already!</Title>
              </JoinContainer>
            )}
          </>
        )}
      </CenteredColumn>
    </Page>
  )
}

export default JoinWorkspace
