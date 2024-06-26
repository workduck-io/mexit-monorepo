import { RecentType, useHistoryStore, useRecentsStore } from '@mexit/core'

import useLoad, { LoadNodeOptions } from './useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from './useRouting'

export const useNavigation = () => {
  // const loadNodeFromId = useEditorStore((store) => store.loadNodeFromId)
  const { loadNode } = useLoad()
  const pushHs = useHistoryStore((store) => store.push)
  const replaceHs = useHistoryStore((store) => store.replace)
  const moveHs = useHistoryStore((store) => store.move)
  const addRecent = useRecentsStore((store) => store.addRecent)
  const { goTo } = useRouting()
  const getCurrentUID = useHistoryStore((store) => store.getCurrentUId)

  const push = (nodeid: string, options?: LoadNodeOptions) => {
    loadNode(nodeid, options)
    pushHs(nodeid)
  }

  const replace = (nodeid: string) => {
    replaceHs(nodeid)
    addRecent(RecentType.notes, nodeid)
    loadNode(nodeid)
  }

  const move = (dist: number) => {
    moveHs(dist)
    const newId = getCurrentUID()
    if (newId) {
      goTo(ROUTE_PATHS.node, NavigationType.push, newId)
      loadNode(newId)
      addRecent(RecentType.notes, newId)
    }
    return newId
  }

  return { push, move, replace }
}
