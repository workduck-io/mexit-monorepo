import { useForm } from 'react-hook-form'

import edit2Line from '@iconify/icons-ri/edit-2-line'

import { useAuth } from '@workduck-io/dwindle'
import { Button, LoadingButton } from '@workduck-io/mex-components'

import { useAuthStore } from '@mexit/core'
import { AuthForm, Group, ImageUploader } from '@mexit/shared'

import { InputFormError } from '../../../Components/Input'
import { useUserService } from '../../../Hooks/API/useUserAPI'
import { SmallHeading, StyledWorkspaceDetails, WorkspaceDetailsContainer } from '../styled'

const WorkspaceDetails = () => {
  const activeWorkspace = useAuthStore((store) => store.workspaceDetails)

  const updateUserForm = useForm()
  const { uploadImageToS3 } = useAuth()
  const { updateWorkspaceDetails } = useUserService()
  const updErrors = updateUserForm.formState.errors

  const onUpdateSave = async (data: any) => {
    await updateWorkspaceDetails(activeWorkspace.id, data)
  }

  const handleUploadImage = (imageUrl: string) => {
    if (imageUrl) {
      onUpdateSave({
        workspaceMetadata: {
          imageUrl
        },
        name: activeWorkspace?.name
      })
    }
  }

  return (
    <StyledWorkspaceDetails>
      <SmallHeading>Details</SmallHeading>
      <WorkspaceDetailsContainer>
        <ImageUploader onUpload={handleUploadImage} uploader={uploadImageToS3} icon={activeWorkspace?.icon} size={48} />
        <AuthForm noStyle onSubmit={updateUserForm.handleSubmit(onUpdateSave)}>
          <InputFormError
            name="name"
            labelIcon={edit2Line}
            inputProps={{
              placeholder: 'Workspace name',
              defaultValue: activeWorkspace?.name,
              isDirty: updateUserForm.formState.dirtyFields?.name,
              ...updateUserForm.register('name')
            }}
            errors={updErrors}
          />

          {updateUserForm.formState.isDirty && Object.keys(updateUserForm.formState.dirtyFields).length > 0 && (
            <Group>
              <LoadingButton loading={updateUserForm.formState.isSubmitting} type="submit" primary>
                Update
              </LoadingButton>
              <Button
                onClick={() => {
                  updateUserForm.reset()
                }}
              >
                Cancel
              </Button>
            </Group>
          )}
        </AuthForm>
      </WorkspaceDetailsContainer>
    </StyledWorkspaceDetails>
  )
}

export default WorkspaceDetails
