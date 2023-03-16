import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Icon } from '@iconify/react'
import { useTheme } from 'styled-components'

import { Infobox, LoadingButton } from '@workduck-io/mex-components'

import { API, mog, usePromptStore } from '@mexit/core'
import {
  ActionGroupIcon,
  DEFAULT_LIST_ITEM_ICON,
  FlexBetween,
  getIconType,
  GroupHeader,
  Input,
  ProjectIconMex,
  ServiceDescription,
  Title
} from '@mexit/shared'

import ServiceInfo from '../../Components/Portals/ServiceInfo'
import { GlobalSectionContainer, GlobalSectionHeader } from '../../Style/GlobalSection'

const PromptProvidersPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [value, setValue] = useState()

  const params = useParams()
  const theme = useTheme()
  const actionGroupId = params.actionGroupId

  const provider = usePromptStore((s) => s.providers.find((i) => i.actionGroupId === actionGroupId))
  const userPromptAuth = usePromptStore((s) => s.userPromptAuthInfo.auth)
  const setUserPromptAuth = usePromptStore((s) => s.setUserPromptAuthInfo)

  const { mexIcon } = getIconType(provider?.icon || DEFAULT_LIST_ITEM_ICON)

  const onInputChange = (event) => {
    const inputTargetValue = event.target.value
    mog('SETTING VALUE', { inputTargetValue })
    setValue(inputTargetValue)
  }

  useEffect(() => {
    API.prompt
      .getUserPromptsAuth()
      .then((res) => setUserPromptAuth(res))
      .catch((err) => console.error('Unable to get user prompt info'))
  }, [])

  const onSaveChanges = async () => {
    if (!isEdit) {
      setIsEdit(true)
      return
    }

    try {
      setIsLoading(true)
      const res = await API.prompt.updateUserPromptsAuth({ accessToken: value })
      if (res) {
        setUserPromptAuth(res)
        setIsEdit(false)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Unable to update Access Token')
      setIsLoading(false)
    }
  }

  return (
    <ServiceInfo>
      <div>
        <ActionGroupIcon>
          <span>
            <ProjectIconMex isMex={mexIcon} icon={provider?.icon} size={140} />
          </span>
        </ActionGroupIcon>
        <GroupHeader>
          <FlexBetween>
            <Title>{provider.name}</Title>
          </FlexBetween>
          <ServiceDescription>
            {provider.description ??
              `Magna quis cupidatat laboris aliquip esse. Ut Despacito eu voluptate qui incididunt ipsum. Officia et esse
              enim laborum ullamco magna labore quis sit mollit. Esse amet nostrud pariatur esse. Commodo consequat
              ipsum tempor ad cillum ad et esse nostrud veniam pariatur excepteur laboris. Adipisicing aliqua do
              proident aliquip ad et voluptate et ut excepteur mollit do tempor. Magna nostrud esse sunt anim quis in.
              Amet ut fugiat adipisicing officia aliquip quis non. Veniam magna dolor consequat quis aliqua ea ipsum
              reprehenderit commodo commodo. Minim minim sit sit magna labore sint esse ipsum.`}
          </ServiceDescription>
        </GroupHeader>
      </div>
      <GlobalSectionContainer>
        <div>You&apos;ve {userPromptAuth.authMetadata.limit} free credits.</div>
        <GlobalSectionHeader>
          <Input
            defaultValue={userPromptAuth.authData.accessToken}
            autoFocus={true}
            disabled={!isEdit}
            placeholder="API KEY"
            onChange={onInputChange}
          />
          <Infobox text={`You can get API KEY from ${provider.authConfig.authURL}`} />
        </GlobalSectionHeader>
        <LoadingButton dots={2} loading={isLoading} onClick={onSaveChanges} transparent>
          <Icon
            color={theme.colors.primary}
            width={24}
            icon={isEdit ? 'teenyicons:tick-circle-outline' : 'clarity:note-edit-line'}
          />
        </LoadingButton>
      </GlobalSectionContainer>
    </ServiceInfo>
  )
}

export default PromptProvidersPage
