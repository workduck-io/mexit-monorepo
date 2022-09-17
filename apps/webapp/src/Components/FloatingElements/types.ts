import { Placement } from '@floating-ui/react-dom-interactions'

export interface Props {
  render: (data: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode
  placement?: Placement
  children: JSX.Element
  hover?: boolean
  open: boolean
  persist?: boolean
  label?: string
  setOpen: (open: boolean) => void
}
