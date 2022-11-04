import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-male-sprites'
import { nanoid } from 'nanoid'

const generateAvatar = () => {
  const seed = nanoid()

  let svg = createAvatar(style, {
    seed: seed
  })

  return { svg, seed }
}
export default generateAvatar
