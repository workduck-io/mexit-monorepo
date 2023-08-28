import { useMentionsHook } from '@mexit/shared'

import { useNodeShareAPI } from './API/useNodeShareAPI'

export const useMentions = () => {
  const { grantUsersPermission } = useNodeShareAPI()

  return useMentionsHook({ grantUsersPermission })
}
