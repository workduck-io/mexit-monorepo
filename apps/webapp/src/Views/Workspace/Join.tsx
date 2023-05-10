import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { CenteredColumn, NavTooltip, PrimaryButton, TitleWithShortcut } from '@workduck-io/mex-components'

import { useAuthStore } from '@mexit/core'
import { Group, IconDisplay, Title, WDLogo } from '@mexit/shared'

import Input from '../../Components/Input'
import { ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import { JoinContainer, Page, PageHeader } from './styled'

const JoinWorkspace = () => {
  const activeWorkspace = useAuthStore((store) => store.workspaceDetails)
  const addWorkspace = useAuthStore((store) => store.addWorkspace)
  const setActiveWorkspace = useAuthStore((store) => store.setActiveWorkspace)

  const { useQuery } = useRouting()
  const query = useQuery()

  useEffect(() => {
    const code = query.get('invite')

    async function getWorkspaceDetails(inviteCode: string) {
      // const workspace = await getWorkspaceByInviteCode(inviteCode)
      // if (workspace) {
      // const workspace = {
      //   id: '0',
      //   name: 'Test Workspace',
      //   icon: DefaultMIcons.WORKSPACE
      // }
      // addWorkspace(workspace)
      // setActiveWorkspace(workspace.id)
      // }
    }

    // getWorkspaceDetails(code)
  }, [])

  const handleOnShow = () => {
    //
  }

  const handleJoinWorkspace = async () => {
    //
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
        <Group>
          <IconDisplay icon={activeWorkspace?.icon} size={32} />
          <h3>{activeWorkspace?.name}</h3>
        </Group>
        s
        <JoinContainer>
          <Title>Join Workspace</Title>
          <Input
            name="invite"
            inputProps={{
              placeholder: 'Enter Invite Code...'
            }}
          />
          <PrimaryButton onClick={handleJoinWorkspace}>Join</PrimaryButton>
        </JoinContainer>
      </CenteredColumn>
    </Page>
  )
}

export default JoinWorkspace
