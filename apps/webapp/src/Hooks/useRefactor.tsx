/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { NodeLink, mog, getUniquePath, isMatch, generateNodeUID } from '@mexit/core'
import { getAllParentIds, getNodeIcon } from '@mexit/shared'

import { useEditorBuffer } from './useEditorBuffer'

import { useRefactorStore } from '../Stores/useRefactorStore'
import { useDataStore } from '../Stores/useDataStore'

export const linkInRefactor = (id: string, refactored: NodeLink[]): false | NodeLink => {
  const index = refactored.map((r) => r.from).indexOf(id)
  if (index === -1) return false
  else return refactored[index]
}

export const useRefactor = () => {
  /*  Notes:
    We need to refactor all ilinks that match with the given regex and replace the initial regex with the refactorId
  
    Then we need to remap the contents to the new IDs.
  
    We will return two functions, first that returns the list of refactoring, the second function applies the refactoring
  
    getMockRefactor is used to get a preview of the links that will be refactored.
    execRefactor will apply the refactor action.
    */

  const setILinks = useDataStore((state) => state.setIlinks)
  const setBaseNodeId = useDataStore((store) => store.setBaseNodeId)
  const { saveAndClearBuffer } = useEditorBuffer()

  /*
   * Returns a mock array of refactored paths
   * Also refactors children
   * from: the current path
   * to: the new changed path
   */
  const getMockRefactor = (from: string, to: string, clearBuffer = true, notification = true): NodeLink[] => {
    if (clearBuffer) saveAndClearBuffer()
    const ilinks = useDataStore.getState().ilinks

    const refactorMap = ilinks.filter((i) => {
      const match = isMatch(i.path, from)
      return match
    })

    const allPaths = ilinks.map((link) => link.path)

    const refactored = refactorMap.map((f) => {
      const uniquePath = getUniquePath(to, allPaths, notification)

      if (uniquePath)
        return {
          from: f.path,
          to: uniquePath?.unique
        }

      return {
        from: f.path,
        to: f.path
      }
    })

    mog('MOCK REFACTOR', { ilinks, from, to, refactorMap, refactored })
    return refactored
  }

  const execRefactor = (from: string, to: string, clearBuffer = true) => {
    const refactored = getMockRefactor(from, to, clearBuffer)

    mog('execRefactor', { from, to, refactored })

    // Generate the new links
    const ilinks = useDataStore.getState().ilinks

    const newIlinks = ilinks.map((i) => {
      for (const ref of refactored) {
        if (ref.from === i.path) {
          return {
            ...i,
            path: ref.to,
            icon: getNodeIcon(ref.to)
          }
        }
      }
      return i
    })

    const isInNewlinks = (l: string) => {
      const ft = newIlinks.filter((i) => i.path === l)
      return ft.length > 0
    }

    const newParents = refactored
      .map((r) => getAllParentIds(r.to))
      .flat()
      .filter((x) => !isInNewlinks(x))

    const newParentIlinks = newParents.map((p) => ({
      path: p,
      nodeid: generateNodeUID(),
      icon: getNodeIcon(p)
    }))

    setILinks([...newIlinks, ...newParentIlinks])

    const baseId = linkInRefactor(useDataStore.getState().baseNodeId, refactored)
    if (baseId !== false) {
      setBaseNodeId(baseId.to)
    }

    return refactored
  }

  return { getMockRefactor, execRefactor }
}

// Used to wrap a class component to provide hooks
export const withRefactor = (Component: any) => {
  return function C2(props: any) {
    const { getMockRefactor, execRefactor } = useRefactor()

    const prefillRefactorModal = useRefactorStore((state) => state.prefillModal)

    return (
      <Component
        getMockRefactor={getMockRefactor}
        execRefactor={execRefactor}
        prefillRefactorModal={prefillRefactorModal}
        {...props}
      />
    )
  }
}
