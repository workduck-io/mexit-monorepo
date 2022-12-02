import React, { useCallback } from 'react'

import { useHistoryStore } from '../Stores/useHistoryStore'
import { useRecentsStore } from '../Stores/useRecentsStore'

import useLoad, { LoadNodeOptions } from './useLoad'
import { NavigationType,ROUTE_PATHS, useRouting } from './useRouting'

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
    addRecent(nodeid)
  }

  const replace = (nodeid: string) => {
    replaceHs(nodeid)
    addRecent(nodeid)
    loadNode(nodeid)
  }

  const move = (dist: number) => {
    moveHs(dist)
    const newId = getCurrentUID()
    if (newId) {
      goTo(ROUTE_PATHS.node, NavigationType.push, newId)
      loadNode(newId)
      addRecent(newId)
    }
    return newId
  }

  return { push, move, replace }
}

// Used to wrap a class component to provide hooks
export const withNavigation = (Component: any) => {
  return function C2(props: any) {
    const { push, move } = useNavigation()
    const { goTo } = useRouting()

    const onPush = useCallback((nodeid: string, options?: LoadNodeOptions) => {
      console.log('onPush', { nodeid, options })
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
      push(nodeid, options)
    }, [])

    return <Component push={onPush} move={move} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
