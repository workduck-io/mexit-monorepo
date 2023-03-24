import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  AccessLevel,
  DefaultPermission,
  DefaultPermissionValue,
  emptyAccessTable,
  InviteModalData,
  mog,
  permissionOptions,
  useAuthStore,
  useEditorStore,
useMentionStore , userPreferenceStore as useUserPreferenceStore,  useShareModalStore
 } from '@mexit/core'
import { mergeAccess, SelectWrapper, StyledCreatatbleSelect } from '@mexit/shared'

import { useNamespaceApi } from '../../Hooks/API/useNamespaceAPI'
import { useNodeShareAPI } from '../../Hooks/API/useNodeShareAPI'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { useLinks } from '../../Hooks/useLinks'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { getEmailStart } from '../../Utils/constants'
import InputBox from '../InputBox'

import { InviteFormFieldset, InviteFormWrapper, StyledLoadingButton } from './styles'

export const MultiEmailInviteModalContent = ({ disabled }: { disabled?: boolean }) => {
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const addMentionable = useMentionStore((state) => state.addMentionable)
  const context = useShareModalStore((state) => state.context)
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
    setValue,
    setError,
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
      const existing = userDetails.filter((p) => p.status === 'fulfilled' && p.value.id !== undefined) as any[]
      const absent = userDetails.filter((p) => p.status === 'fulfilled' && p.value.id === undefined) as any[]

      const givePermToExisting = existing
        .reduce((p, c) => {
          return [...p, c.value.id]
        }, [])
        .filter((u) => u !== localuserDetails.id)

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
          id: u?.value?.id,
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
    <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
      <InviteFormFieldset inline>
        <InputBox
          inputProps={{
            transparent: true,
            autoFocus: true,
            name: 'email',
            placeholder: "Enter user's emails...",
            type: 'email',
            // Accepts multiple emails
            errors,
            multiple: true,
            register
          }}
          rightChild={
            <SelectWrapper>
              <Controller
                control={control}
                render={({ field }) => (
                  <StyledCreatatbleSelect
                    {...field}
                    isSearchable={false}
                    menuPortalTarget={document.getElementById('table')}
                    style={{ transparent: true }}
                    defaultValue={DefaultPermissionValue}
                    options={permissionOptions}
                    closeMenuOnSelect={true}
                    closeMenuOnBlur={true}
                  />
                )}
                name="access"
              />
            </SelectWrapper>
          }
        />

        <StyledLoadingButton
          loading={isSubmitting}
          type="submit"
          primary
          alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
        >
          Invite
        </StyledLoadingButton>
      </InviteFormFieldset>
    </InviteFormWrapper>
  )
}
