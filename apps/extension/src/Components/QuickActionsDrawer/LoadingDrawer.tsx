import { useLayoutStore } from '@mexit/core'
import { DrawerHeader } from '@mexit/shared'

import { QuickActionsDrawerContainer } from './styled'

const LoadingDrawer = () => {
  const drawerState = useLayoutStore((store) => store.drawer)

  return (
    <QuickActionsDrawerContainer>
      <DrawerHeader align="center" isLoading={drawerState.data?.isLoading} title={drawerState.data?.title} />
    </QuickActionsDrawerContainer>
  )
}

export default LoadingDrawer
