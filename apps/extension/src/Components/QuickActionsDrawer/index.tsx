import { DrawerType, useLayoutStore } from '@mexit/core'

import AddToNotes from './AddToNotes'
import LinkedNotes from './LinkedNotes'

const QuickActionsDrawer = () => {
  const drawer = useLayoutStore((store) => store.drawer)

  switch (drawer) {
    case DrawerType.ADD_TO_NOTE: {
      return <AddToNotes />
    }

    case DrawerType.LINKED_NOTES: {
      return <LinkedNotes />
    }
  }
}

export default QuickActionsDrawer
