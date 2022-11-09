import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-male-sprites'
import { nanoid } from 'nanoid'

export const generateAvatar = (height?: number, width?: number) => {
  const seed = nanoid();
  const svg = createAvatar(style, {
    seed: seed,
    base64: true,
    height: height ?? 150,
    width: width ?? 150
  })
  return {svg , seed}
}