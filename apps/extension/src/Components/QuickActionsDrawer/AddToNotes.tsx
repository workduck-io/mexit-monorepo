import {
  DrawerType,
  getHighlightBlockMap,
  getHighlightContent,
  Highlight,
  useDataStore,
  useHighlightStore,
  useLayoutStore
} from '@mexit/core'
import { DrawerHeader, NotePicker } from '@mexit/shared'

import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import { useSaveChanges } from '../../Hooks/useSaveChanges'

import { DrawerContent, QuickActionsDrawerContainer } from './styled'

const AddToNotes = () => {
  const { accessWhenShared } = usePermissions()
  const { appendAndSave } = useSaveChanges()

  const updateHighlightBlockMap = useHighlightStore((store) => store.updateHighlightBlockMap)
  const setDrawerState = useLayoutStore((store) => store.setDrawer)
  const notes = useDataStore((state) => state.ilinks.filter((note) => !isReadonly(accessWhenShared(note.nodeid))))

  const onSelect = (nodeId: string) => {
    const highlight = useLayoutStore.getState().drawer?.data as Highlight
    setDrawerState({
      type: DrawerType.LOADING,
      data: {
        title: 'Saving Changes',
        isLoading: true
      }
    })

    const content = getHighlightContent(highlight)

    appendAndSave({
      content,
      nodeid: nodeId,
      notification: false
    }).then((s) => {
      const blockHighlightMap = getHighlightBlockMap(nodeId, content)
      updateHighlightBlockMap(highlight.entityId, blockHighlightMap)

      setDrawerState({
        type: DrawerType.LOADING,
        data: {
          title: 'Saved!',
          isLoading: false
        }
      })

      setTimeout(() => {
        setDrawerState(null)
      }, 700)
    })
  }

  return (
    <QuickActionsDrawerContainer>
      <DrawerHeader title="Add To Notes" />
      <DrawerContent>
        <NotePicker items={notes} onSelect={onSelect} />
      </DrawerContent>
    </QuickActionsDrawerContainer>
  )
}

export default AddToNotes
