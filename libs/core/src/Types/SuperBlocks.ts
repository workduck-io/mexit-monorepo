export enum SuperBlocks {
  CONTENT = 'super-block-content',
  MEDIA = 'super-block-media',
  TASK = 'super-block-task',
  HIGHLIGHT = 'super-block-highlight',
  CAPTURE = 'super-block-capture',
  MEET = 'super-block-meet',
  AI = 'super-block-ai'
}

export const SUPER_BLOCK_PREFIX = 'super-block-'

export type SuperBlocksType<Str extends string> = `super-block-${Lowercase<Str>}`

const SuperBlockFields = {
  [SuperBlocks.TASK]: ['status', 'assignee', 'priority']
}

/**
 *
 * @param type : SuperBlocks
 * @param field : string
 *
 * Returns true if the field is valid for the superblock type
 */
export const superBlockFieldValidator = (type: SuperBlocks, field: string) => {
  switch (type) {
    case SuperBlocks.CONTENT:
    case SuperBlocks.TASK:
      return !['url'].includes(field)
    default: {
      return true
    }
  }
}

export const getSuperBlockFields = (item: any) => {
  switch (item.entity) {
    case SuperBlocks.TASK:
      return item
    default:
      // eslint-disable-next-line no-case-declarations
      const properties = item.data.properties ?? {}

      return {
        ...item,
        data: {
          ...item.data,
          properties: Object.entries(properties).reduce((acc, [key, value]) => {
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
          }, {})
        }
      }
  }
}
