import { WORKSPACE_HEADER } from '@mexit/core'
import { useAuthStore } from '../../Stores/useAuth'

export const useAPIHeaders = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  return {
    workspaceHeaders: () => ({
      [WORKSPACE_HEADER]: getWorkspaceId(),
      Accept: 'application/json, text/plain, */*'
    }),
    workspaceId: () => getWorkspaceId()
  }
}
