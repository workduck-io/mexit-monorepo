export enum indexNames {
  'node' = 'node',
  'snippet' = 'snippet',
  'archive' = 'archive',
  'template' = 'template',
  'shared' = 'shared'
}

export const indexKeys: Record<indexNames, string[]> = {
  [indexNames.node]: ['title.cfg', 'title.ctx', 'title.map', 'text.cfg', 'text.ctx', 'text.map', 'reg', 'store', 'tag'],
  [indexNames.archive]: [
    'title.cfg',
    'title.ctx',
    'title.map',
    'text.cfg',
    'text.ctx',
    'text.map',
    'reg',
    'store',
    'tag'
  ],
  [indexNames.snippet]: [
    'title.cfg',
    'title.ctx',
    'title.map',
    'text.cfg',
    'text.ctx',
    'text.map',
    'reg',
    'store',
    'tag'
  ],
  [indexNames.template]: [
    'title.cfg',
    'title.ctx',
    'title.map',
    'text.cfg',
    'text.ctx',
    'text.map',
    'reg',
    'store',
    'tag'
  ],
  [indexNames.shared]: [
    'title.cfg',
    'title.ctx',
    'title.map',
    'text.cfg',
    'text.ctx',
    'text.map',
    'reg',
    'store',
    'tag'
  ]
}

export const diskIndex: Record<indexNames, any> = {
  node: {},
  snippet: {},
  archive: {},
  template: {},
  shared: {}
}
