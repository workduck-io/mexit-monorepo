import { useMemo } from 'react'

import { useForm, Controller } from 'react-hook-form'

import { LoadingButton } from '@workduck-io/mex-components'

import {
  mog,
  AccessLevel,
  DefaultPermission,
  DefaultPermissionValue,
  permissionOptions,
  emptyAccessTable
} from '@mexit/core'
import { Label, SelectWrapper, StyledCreatatbleSelect } from '@mexit/shared'

import { useNodeShareAPI } from '../../Hooks/API/useNodeShareAPI'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { useLinks } from '../../Hooks/useLinks'
import { useAuthStore } from '../../Stores/useAuth'
import { useEditorStore } from '../../Stores/useEditorStore'
import { mergeAccess, useMentionStore } from '../../Stores/useMentionsStore'
import { InviteModalData, useShareModalStore } from '../../Stores/useShareModalStore'
import { ModalHeader, ModalControls } from '../../Style/Refactor'
import { getEmailStart, MultiEmailValidate } from '../../Utils/constants'
import { InputFormError } from '../Input'
import { MultipleInviteWrapper, InviteFormWrapper, InviteFormFieldset } from './styles'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useNamespaceApi } from '../../Hooks/API/useNamespaceAPI'
import { useNamespaces } from '../../Hooks/useNamespaces'

export const MultiEmailInviteModalContent = ({ disabled }: { disabled?: boolean }) => {
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const addMentionable = useMentionStore((state) => state.addMentionable)
  const context = useShareModalStore((state) => state.context)
  // const closeModal = useShareModalStore((state) => state.closeModal)
  const { getPathFromNodeid } = useLinks()
  const { getUserDetails } = useUserService()
  const { grantUsersPermission: grantUsersPermissionNode } = useNodeShareAPI()
  const { shareNamespace } = useNamespaceApi()
  const { getNamespace } = useNamespaces()
  const localuserDetails = useAuthStore((s) => s.userDetails)
  const node = useEditorStore((state) => state.node)
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const modalData = useShareModalStore((state) => state.data)
  const id = useMemo(() => {
    if (context === 'note') return modalData?.nodeid ?? node?.nodeid
    else return modalData?.namespaceid ?? currentSpace
  }, [modalData.nodeid, node, modalData.namespaceid, currentSpace, context])

  const title = useMemo(() => {
    if (context === 'note') return getPathFromNodeid(id)
    else {
      const ns = getNamespace(id)
      return ns?.name
    }
  }, [id, context])

  const onSubmit = async (data: InviteModalData) => {
    mog('data', data)

    if (id) {
      const allMails = data.email.split(',').map((e) => e.trim())
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const userDetailPromises = allMails
        .filter((e) => e !== localuserDetails.email)
        .map((email) => {
          return getUserDetails(email)
        })

      const userDetails = await Promise.allSettled(userDetailPromises)

      mog('userDetails', { userDetails })

      // Typescript has some weird thing going on with promises.
      // Try to improve the type (if you can that is)
      const existing = userDetails.filter((p) => p.status === 'fulfilled' && p.value.userID !== undefined) as any[]
      const absent = userDetails.filter((p) => p.status === 'fulfilled' && p.value.userID === undefined) as any[]

      const givePermToExisting = existing
        .reduce((p, c) => {
          return [...p, c.value.userID]
        }, [])
        .filter((u) => u !== localuserDetails.userID)

      // Only share with users registered,
      if (givePermToExisting.length > 0) {
        // TODO: use context
        const permGiven =
          context === 'note'
            ? await grantUsersPermissionNode(id, givePermToExisting, access)
            : await shareNamespace(id, givePermToExisting, access)
        mog('userDetails', { userDetails, permGiven, existing, absent, givePermToExisting })
      }

      existing.forEach((u) => {
        addMentionable({
          type: 'mentionable',
          alias: u?.value?.alias ?? '',
          email: u?.value?.email,
          userID: u?.value?.userID,
          name: u?.value?.name,
          access: mergeAccess(emptyAccessTable, {
            [context]: {
              [id]: access
            }
          })
        })
      })

      // Add the rest to invited users
      absent.forEach((u) => {
        addInvitedUser({
          type: 'invite',
          alias: getEmailStart(u?.value?.email),
          email: u?.value?.email,
          access: mergeAccess(emptyAccessTable, {
            [context]: {
              [id]: access
            }
          })
        })
      })
    }
  }

  return (
    <MultipleInviteWrapper>
      <ModalHeader>Invite Users</ModalHeader>
      <p>
        Invite your friends to your {context} <strong>{title}</strong>
      </p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InviteFormFieldset disabled={disabled}>
          <InputFormError
            name="email"
            label="Emails"
            inputProps={{
              autoFocus: true,
              placeholder: 'alice@email.com, bob@email.com',
              type: 'email',
              // Accepts multiple emails
              multiple: true,
              ...register('email', {
                required: true,
                validate: MultiEmailValidate
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

          <ModalControls>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              primary
              large
              alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            >
              Invite
            </LoadingButton>
          </ModalControls>
        </InviteFormFieldset>
      </InviteFormWrapper>
    </MultipleInviteWrapper>
  )
}
