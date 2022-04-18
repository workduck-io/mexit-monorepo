import { MexIcons } from '../Utils/Icons'

export interface TreeNode {
  title: string
  id: string
  nodeid: string
  key: string
  mex_icon: keyof typeof MexIcons | undefined
  children: TreeNode[]
}
