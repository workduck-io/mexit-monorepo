import { useForm, Controller } from 'react-hook-form'
import { getPlateEditorRef, usePlateEditorRef } from '@udecode/plate'

import { mog, AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '@mexit/core'
import { Label, StyledCreatatbleSelect, ButtonFields } from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useShareModalStore, InviteModalData } from '../../Stores/useShareModalStore'
import { Title } from '../../Style/Integrations'
import { EMAIL_REG } from '../../Utils/constants'
import { LoadingButton } from '../Buttons/Buttons'
import { InputFormError } from '../Input'
import { InviteWrapper, InviteFormWrapper, SelectWrapper } from './styles'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { replaceUserMention, replaceUserMentionEmail } from '../../Editor/Actions/replaceUserMention'
import { usePermission } from '../../Hooks/API/usePermission'

export const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const closeModal = useShareModalStore((state) => state.closeModal)
  const node = useEditorStore((state) => state.node)
  const { getUserDetails } = useUserService()
  const { inviteUser, addMentionable } = useMentions()
  const { grantUsersPermission } = usePermission()

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = async (data: InviteModalData) => {
    if (node && node.nodeid) {
      const editor = getPlateEditorRef()
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const details = await getUserDetails(data.email)
      mog('data', { data, details })

      if (details.userId !== undefined) {
        // Give permission here
        const resp = await grantUsersPermission(node.nodeid, [details.userId], access)
        mog('UserPermission given', { details, resp })
        addMentionable(data.alias, data.email, details.userId, node.nodeid, access)
        replaceUserMention(editor, data.alias, details.userId)
      } else {
        inviteUser(data.email, data.alias, node.nodeid, access)
        replaceUserMentionEmail(editor, data.alias, details.email)
      }
    }

    closeModal()
  }

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InputFormError
          name="alias"
          label="Alias"
          inputProps={{
            defaultValue: data.alias ?? '',
            ...register('alias', {
              required: true
            })
          }}
          errors={errors}
        ></InputFormError>
        <InputFormError
          name="email"
          label="Email"
          inputProps={{
            autoFocus: true,
            ...register('email', {
              required: true,
              pattern: EMAIL_REG
            })
          }}
          errors={errors}
        ></InputFormError>

        <SelectWrapper>
          <Label htmlFor="access">Permission</Label>
          <Controller
            control={control}
            render={({ field }) => (
              <StyledCreatatbleSelect
                {...field}
                defaultValue={DefaultPermissionValue}
                options={permissionOptions}
                closeMenuOnSelect={true}
                closeMenuOnBlur={true}
              />
            )}
            name="access"
          />
        </SelectWrapper>

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite
          </LoadingButton>
        </ButtonFields>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}
