import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { NavLink } from 'react-router-dom'

import { CenteredColumn, NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'

import { API, AppInitStatus, useAuthStore, useStore, Workspace } from '@mexit/core'
import { DefaultMIcons, FadeContainer, Group, IconDisplay, Loading, Margin, Title, WDLogo } from '@mexit/shared'

import Input from '../../Components/Input'
import { DeletionWarning } from '../../Components/Modals/DeleteSpaceModal/styled'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { resetSearchIndex } from '../../Workers/controller'

import { JoinContainer, Page, PageHeader, StyledPrimaryButton } from './styled'

const JoinWorkspace = () => {
  const [join, setJoin] = useState<boolean>(true)
  const [loading, setLoading] = useState(true)
  const authenticated = useAuthStore((store) => store.authenticated)
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace | undefined>()
  const addWorkspace = useAuthStore((store) => store.addWorkspace)
  const activeWorkspace = useAuthStore((store) => store.workspaceDetails)
  const setActiveWorkspace = useAuthStore((store) => store.setActiveWorkspace)
  const setAppInitStatus = useAuthStore((store) => store.setAppInitStatus)

  const { backup } = useStore()
  const { useQuery } = useRouting()

  const code = useQuery().get('invite') || ''
  const { goTo } = useRouting()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: {
      invite: code
    }
  })

  const getWorkspaceById = async (inviteCode: string) => {
    if (!inviteCode) return

    try {
      const res = await API.invite.get(inviteCode)
      if (res.workspaceId) {
        const workspace = useAuthStore.getState().workspaces.find((w) => w.id === res.workspaceId)
        if (workspace)
          return {
            existing: true,
            workspace
          }
      } else {
        const workspaceFromId = await API.workspace.getWorkspaceByIds({
          ids: [res.workspaceId]
        })

        if (workspaceFromId) {
          return {
            workspace: workspaceFromId?.[res.workspaceId],
            existing: false
          }
        }
      }
    } catch (er) {
      console.error('Unable to get workspace from invite code', er)
    }
  }

  useEffect(() => {
    async function getWorkspaceDetails(inviteCode: string) {
      const workspaceJoinDetails = await getWorkspaceById(inviteCode)
      if (workspaceJoinDetails) {
        setJoin(!workspaceJoinDetails?.existing)
        setWorkspaceDetails(workspaceJoinDetails.workspace)
      }

      setLoading(false)
    }

    if (code) getWorkspaceDetails(code)
    else setLoading(false)

    return () => setJoin(true)
  }, [])

  const handleOnShow = () => {
    //
  }

  const handleJoinWorkspace = async (value) => {
    if (!authenticated) {
      goTo(`${ROUTE_PATHS.register}?invite=${value.invite}`, NavigationType.replace)
      return
    }

    const inviteCode = getValues('invite')

    try {
      const data = await API.user.addExistingUserToWorkspace(inviteCode)
      const workspaceId = data?.workspaceId

      if (workspaceId) {
        const resp = await API.workspace.getWorkspaceByIds({
          ids: [data.workspaceId]
        })

        if (resp?.[workspaceId]) {
          setWorkspaceDetails(resp[workspaceId])

          backup().then(() => {
            resetSearchIndex()
            setAppInitStatus(AppInitStatus.SWITCH)
          })

          addWorkspace(resp[workspaceId], true)
        }
      }
    } catch (err) {
      toast('Something went wrong!')
      console.error('Unable to add user to Workspace', err)
    }
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
      <FadeContainer fade>
        <CenteredColumn>
          {loading ? (
            <Loading transparent dots={5} />
          ) : (
            <>
              <Group>
                <IconDisplay icon={workspaceDetails?.icon ?? DefaultMIcons.WORKSPACE} size={32} />
                {workspaceDetails && <h3>{workspaceDetails?.name}</h3>}
              </Group>
              {join ? (
                <JoinContainer onSubmit={handleSubmit(handleJoinWorkspace)}>
                  <Title noMargin>{workspaceDetails?.name ? 'Join this workspace' : 'Join a new Workspace'}</Title>
                  {!workspaceDetails?.name && (
                    <DeletionWarning align>Have an invite code? Enter it here to get started!</DeletionWarning>
                  )}
                  <Margin />
                  <Input
                    name="invite"
                    inputProps={{
                      autoFocus: true,
                      placeholder: 'Invite Code...',
                      ...register('invite', {
                        required: true
                      })
                    }}
                  />
                  <StyledPrimaryButton
                    type="submit"
                    disabled={errors.invite !== undefined || (!isDirty && !code)}
                    async
                  >
                    {authenticated ? 'Join' : 'Register to Join'}
                  </StyledPrimaryButton>
                </JoinContainer>
              ) : (
                <JoinContainer>
                  <Title center>You&apos;re already a member of this Workspace!</Title>
                </JoinContainer>
              )}
            </>
          )}
        </CenteredColumn>
      </FadeContainer>
    </Page>
  )
}

export default JoinWorkspace
