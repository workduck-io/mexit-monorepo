import { useAuthStore, WORKSPACE_HEADER } from '@mexit/core'


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
