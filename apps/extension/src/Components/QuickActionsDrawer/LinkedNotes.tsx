import { DrawerHeader } from '@mexit/shared'

import { QuickActionsDrawerContainer } from './styled'

const LinkedNotes = () => {
  const count = 1
  const description = `This highlight is linked with ${count} note(s).`

  return (
    <QuickActionsDrawerContainer>
      <DrawerHeader title="Linked Notes" description={description} />
    </QuickActionsDrawerContainer>
  )
}

export default LinkedNotes
