export const FOCUS_MODE_OPACITY = 0

export enum indexNames {
  'node' = 'node',
  'snippet' = 'snippet',
  'archive' = 'archive'
}

export const diskIndex: Record<indexNames, any> = {
  node: {},
  snippet: {},
  archive: {}
}

export const WORKSPACE_HEADER = 'mex-workspace-id'
export const DEFAULT_NAMESPACE = 'NAMESPACE1'
export const GET_REQUEST_MINIMUM_GAP = 5