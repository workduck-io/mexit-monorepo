export enum SuperBlocks {
  CONTENT = 'super-block-content',
  MEDIA = 'super-block-media',
  TASK = 'super-block-task',
  HIGHLIGHT = 'super-block-highlight',
  CAPTURE = 'super-block-capture'
}

export const SUPER_BLOCK_PREFIX = 'super-block-'

export type SuperBlocksType<Str extends string> = `super-block-${Lowercase<Str>}`

let blockType: SuperBlocksType<'content'>

const SuperBlockFields = {
  [SuperBlocks.TASK]: ['status', 'assignee', 'priority']
}

export const getSuperBlockFields = (item: any) => {
  switch (item.entity) {
    case SuperBlocks.TASK:
      return item
    default:
      return {
        ...item,
        data: {
          ...item.data,
          properties: Object.entries(item.data.properties).reduce((acc, [key, value]) => {
            if (
              !Object.keys(SuperBlockFields)
                .filter((field) => field !== item.entity)
                .find((field) => SuperBlockFields[field].includes(key))
            ) {
              return {
                ...acc,
                [key]: value
              }
            }

            return acc
          })
        }
      }
  }
}
