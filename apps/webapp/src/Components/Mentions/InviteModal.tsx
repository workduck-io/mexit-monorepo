import { useForm, Controller } from 'react-hook-form'

import { mog } from '@mexit/core'
import { Label, StyledCreatatbleSelect, ButtonFields } from '@mexit/shared'

import { useMentions } from '../../Hooks/useMentions'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useShareModalStore, InviteModalData } from '../../Stores/useShareModalStore'
import { Title } from '../../Style/Integrations'
import { AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '../../Types/Mentions'
import { EMAIL_REG } from '../../Utils/constants'
import { LoadingButton } from '../Buttons/Buttons'
import { InputFormError } from '../Input'
import { InviteWrapper, InviteFormWrapper, SelectWrapper } from './styles'

export const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const node = useEditorStore((state) => state.node)
  const { inviteUser } = useMentions()
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = (data: InviteModalData) => {
    mog('data', data)

    if (node && node.nodeid) {
      inviteUser(data.email, data.alias, node.nodeid, (data.access as AccessLevel) ?? DefaultPermission)
    }
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
