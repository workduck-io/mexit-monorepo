import React, { useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getPlateEditorRef } from '@udecode/plate'

import { mog, AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '@mexit/core'
import { Label, StyledCreatatbleSelect, ButtonFields, SelectWrapper } from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useShareModalStore, InviteModalData } from '../../Stores/useShareModalStore'
import { Title } from '../../Style/Integrations'
import { EMAIL_REG } from '../../Utils/constants'
import { LoadingButton } from '../Buttons/Buttons'
import { InputFormError } from '../Input'
import { InviteWrapper, InviteFormWrapper, InviteFormFieldset } from './styles'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { replaceUserMention, replaceUserMentionEmail } from '../../Editor/Actions/replaceUserMention'
import { usePermission } from '../../Hooks/API/usePermission'
import { useAuthStore } from '../../Stores/useAuth'
import { useNodes } from '../../Hooks/useNodes'

export const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const closeModal = useShareModalStore((state) => state.closeModal)
  const { getUserDetails } = useUserService()
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const node = useEditorStore((state) => state.node)
  const { inviteUser, addMentionable } = useMentions()
  const { grantUsersPermission } = usePermission()
  const { accessWhenShared } = useNodes()

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const readOnly = useMemo(() => {
    const access = accessWhenShared(node.nodeid)
    if (access) return access !== 'MANAGE'
    // By default, if no access -> user is the owner
    return false
  }, [node])

  const onSubmit = async (data: InviteModalData) => {
    if (node && node.nodeid) {
      const editor = getPlateEditorRef()
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const details = await getUserDetails(data.email)
      mog('data', { data, details })

      if (details.userID !== undefined) {
        // Give permission here
        if (details.userID === currentUserDetails.userID) {
          toast("Can't Invite Yourself")
          closeModal()
          return
        }
        const resp = await grantUsersPermission(node.nodeid, [details.userID], access)
        mog('UserPermission given', { details, resp })
        addMentionable(details.alias, data.email, details.userID, node.nodeid, access)
        replaceUserMention(editor, data.alias, details.userID)
        toast(`Shared with: ${data.email}`)
      } else {
        inviteUser(data.email, data.alias, node.nodeid, access)
        replaceUserMentionEmail(editor, data.alias, details.email)
        toast(`${data.email} is not on Mex, added to Invited Users`)
      }
    }

    closeModal()
  }

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InviteFormFieldset disabled={readOnly}>
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
        </InviteFormFieldset>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}
