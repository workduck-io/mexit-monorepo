import React, { useMemo, useEffect, useState } from 'react'

import { getPlateEditorRef } from '@udecode/plate'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import { LoadingButton } from '@workduck-io/mex-components'

import { mog, AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '@mexit/core'
import { Label, StyledCreatatbleSelect, ButtonFields, SelectWrapper, IntegrationTitle } from '@mexit/shared'

import { replaceUserMention, replaceUserMentionEmail } from '../../Editor/Actions/replaceUserMention'
import { useNodeShareAPI } from '../../Hooks/API/useNodeShareAPI'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { useMentions } from '../../Hooks/useMentions'
import { useAuthStore } from '../../Stores/useAuth'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useShareModalStore, InviteModalData } from '../../Stores/useShareModalStore'
import { EMAIL_REG } from '../../Utils/constants'
import { InputFormError } from '../Input'
import { InviteWrapper, InviteFormWrapper, InviteFormFieldset } from './styles'
import { ModalHeader } from '../../Style/Refactor'
import { usePermissions } from '../../Hooks/usePermissions'

export const InviteModalContent = () => {
  const sModalData = useShareModalStore((state) => state.data)
  // const data = useShareModalStore((state) => state.data)
  const closeModal = useShareModalStore((state) => state.closeModal)
  const context = useShareModalStore((state) => state.context)
  const { getUserDetails, getUserDetailsUserId } = useUserService()
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const node = useEditorStore((state) => state.node)
  const { inviteUser, addMentionable } = useMentions()
  const { grantUsersPermission } = useNodeShareAPI()
  const { accessWhenShared } = usePermissions()

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const readOnly = useMemo(() => {
    const access = accessWhenShared(node.nodeid)
    if (access) return access.note !== 'MANAGE' && access.space !== 'MANAGE'

    // By default, if no access -> user is the owner
    return false
  }, [node])

  const [existUserDetails, setExistUserDetails] = useState<any | null>(null)

  useEffect(() => {
    async function getUserDetailsById() {
      const user = await getUserDetailsUserId(sModalData.userid)
      setExistUserDetails(user)

      if (user?.email && user?.alias) {
        setValue('email', user.email)
        setValue('alias', user.alias)
      }
    }
    if (sModalData.userid) getUserDetailsById()
  }, [sModalData.userid]) // eslint-disable-line

  const onSubmit = async (data: InviteModalData) => {
    if (node && node.nodeid) {
      const editor = getPlateEditorRef()
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const details = await getUserDetails(data.email)
      mog('data', { data, details, node })

      if (details.userID !== undefined) {
        // Give permission here
        if (details.userID === currentUserDetails.userID) {
          toast("Can't Invite Yourself")
          closeModal()
          return
        }
        if (data?.access?.value !== 'NONE') {
          const resp = await grantUsersPermission(node.nodeid, [details.userID], access)
          mog('UserPermission given', { details, resp })
          addMentionable(details.alias, data.email, details.userID, details.name, {
            context,
            id: node.nodeid,
            access
          })
        } else {
          // Case for inserting mention without sharing
          addMentionable(details.alias, data.email, details.userID, details.name)
        }
        if (!sModalData.userid) {
          replaceUserMention(editor, data.alias, details.userID)
        }
        if (data?.access?.value !== 'NONE') {
          toast(`Shared with: ${data.email}`)
        } else toast(`Added mention for: ${data.email}`)
      } else {
        inviteUser(data.email, data.alias, node.nodeid, context, access)
        if (!sModalData.userid) {
          replaceUserMentionEmail(editor, data.alias, details.email)
        }
        toast(`${data.email} is not on Mex, added to Invited Users`)
      }
    }

    closeModal()
  }

  mog('InviteModalContent', {
    existUserDetails
  })

  return (
    <InviteWrapper>
      <ModalHeader>Invite</ModalHeader>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InviteFormFieldset disabled={readOnly}>
          <InputFormError
            name="alias"
            label="Alias"
            inputProps={{
              defaultValue: sModalData.alias ?? existUserDetails?.alias ?? '',
              readOnly: existUserDetails?.alias !== undefined,
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
              defaultValue: existUserDetails?.email ?? '',
              readOnly: existUserDetails?.email !== undefined,
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
                  options={[...permissionOptions, { value: 'NONE', label: 'None' }]}
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
              type="submit"
              primary
              large
            >
              Invite
            </LoadingButton>
          </ButtonFields>
        </InviteFormFieldset>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}
