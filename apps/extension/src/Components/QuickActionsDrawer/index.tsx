import { DrawerType, useLayoutStore } from '@mexit/core'

import AddToNotes from './AddToNotes'
import LinkedNotes from './LinkedNotes'
import LoadingDrawer from './LoadingDrawer'

const QuickActionsDrawer = () => {
  const drawer = useLayoutStore((store) => store.drawer)

  switch (drawer?.type) {
    case DrawerType.ADD_TO_NOTE: {
      return <AddToNotes />
    }

    case DrawerType.LINKED_NOTES: {
      return <LinkedNotes />
    }

    case DrawerType.LOADING: {
      return <LoadingDrawer />
    }

    default:
      return null
  }
}

export default QuickActionsDrawer
