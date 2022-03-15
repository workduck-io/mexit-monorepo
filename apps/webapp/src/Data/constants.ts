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
