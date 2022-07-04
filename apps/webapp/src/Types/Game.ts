export interface MouseSpriteProps {
  x: number
  y: number
  clickHandler: () => void
}

export interface KeySpriteProps {
  x: number
  y: number
  letter: string
}

export interface LayoverProps {
  active: boolean
  children: React.ReactNode
  cb: () => void
}
