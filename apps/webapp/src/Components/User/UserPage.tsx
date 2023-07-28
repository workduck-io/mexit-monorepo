import { useForm } from 'react-hook-form'

import deleteBack2Line from '@iconify/icons-ri/delete-back-2-line'
import edit2Line from '@iconify/icons-ri/edit-2-line'

import { IconButton, LoadingButton } from '@workduck-io/mex-components'

import { IS_DEV, useAuthStore } from '@mexit/core'
import {
  AuthForm,
  ButtonFields,
  CopyButton,
  Info,
  InfoData,
  InfoDataText,
  InfoLabel,
  ProfileContainer,
  ProfileIcon,
  ProfileImage,
  Title,
  UserCard
} from '@mexit/shared'

import { useUserService } from '../../Hooks/API/useUserAPI'
import { ALIAS_REG } from '../../Utils/constants'
import { InputFormError } from '../Input'

export interface UpdateUserFormData {
  name: string
  alias: string
}

const UserPage = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { updateUserInfo } = useUserService()

  const currentUserDetails = useAuthStore((store) => store.userDetails)
  const updateUserForm = useForm<UpdateUserFormData>()

  const onUpdateSave = async (data: UpdateUserFormData) => {
    // mog('onUpdateSave', { data })
    await updateUserInfo(currentUserDetails.id, data.name, data.alias)
    updateUserForm.reset()
  }

  const updErrors = updateUserForm.formState.errors

  // mog('userForms', { currentUserDetails, fS: updateUserForm.formState, dfs: updateUserForm.formState.dirtyFields })

  return (
    <ProfileContainer>
      <UserCard>
        <Title>User</Title>
        <AuthForm onSubmit={updateUserForm.handleSubmit(onUpdateSave)}>
          <InputFormError
            name="name"
            label="Name"
            labelIcon={edit2Line}
            inputProps={{
              placeholder: 'Ex: Cool Guy',
              defaultValue: currentUserDetails?.name,
              isDirty: updateUserForm.formState.dirtyFields?.name,
              ...updateUserForm.register('name')
            }}
            errors={updErrors}
          ></InputFormError>

          <InputFormError
            name="alias"
            label="Alias"
            labelIcon={edit2Line}
            inputProps={{
              placeholder: 'Ex: CoolGal',
              defaultValue: currentUserDetails?.alias,
              isDirty: updateUserForm.formState.dirtyFields?.alias,
              ...updateUserForm.register('alias', {
                pattern: ALIAS_REG
              })
            }}
            errors={updErrors}
          ></InputFormError>
          <Info>
            <InfoLabel>Email</InfoLabel>
            <InfoData>
              <InfoDataText>{currentUserDetails?.email}</InfoDataText>
            </InfoData>
          </Info>

          {IS_DEV && (
            <Info>
              <InfoLabel>User ID</InfoLabel>
              <InfoData>
                <InfoDataText>{currentUserDetails?.id}</InfoDataText>
                <CopyButton text={currentUserDetails?.id}></CopyButton>
              </InfoData>
            </Info>
          )}

          {updateUserForm.formState.isDirty && Object.keys(updateUserForm.formState.dirtyFields).length > 0 && (
            <ButtonFields>
              <LoadingButton loading={updateUserForm.formState.isSubmitting} type="submit" primary large>
                Save Changes
              </LoadingButton>
              <IconButton
                title="Cancel"
                icon={deleteBack2Line}
                onClick={() => {
                  updateUserForm.reset()
                }}
              />
            </ButtonFields>
          )}
        </AuthForm>
      </UserCard>
      <ProfileIcon>
        <ProfileImage email={currentUserDetails?.email} size={128} />
      </ProfileIcon>
    </ProfileContainer>
  )
}

export default UserPage
