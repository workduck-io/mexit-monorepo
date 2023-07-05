export enum SuperBlocks {
  CONTENT = 'super-block-content',
  MEDIA = 'super-block-media',
  TASK = 'super-block-task',
  HIGHLIGHT = 'super-block-highlight',
  CAPTURE = 'super-block-capture'
}

export type SuperBlocksType<Str extends string> = `super-block-${Lowercase<Str>}`

let blockType: SuperBlocksType<'content'>
