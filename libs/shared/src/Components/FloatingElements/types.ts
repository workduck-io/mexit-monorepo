import { Placement } from '@floating-ui/react-dom-interactions'

export interface Props {
  render: (data: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode
  root?: HTMLElement | null
  placement?: Placement
  children: JSX.Element
  hover?: boolean
  scrollLock?: boolean
  open: boolean
  persist?: boolean
  label?: string
  setOpen: (open: boolean) => void
}
