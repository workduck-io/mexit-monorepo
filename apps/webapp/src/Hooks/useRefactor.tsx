/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { NodeLink, mog, getUniquePath, isMatch, ILink } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useRefactorStore } from '../Stores/useRefactorStore'
import { RefactorPath } from '../Stores/useRenameStore'
import { useApi } from './API/useNodeAPI'
import { useEditorBuffer } from './useEditorBuffer'
import { useLinks } from './useLinks'

interface NamespaceChangedPaths {
  removedPaths: ILink[]
  addedPaths: ILink[]
}

interface RefactorResponse {
  changedPaths: Record<string, NamespaceChangedPaths>
}

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
  const { getNodeidFromPath, updateILinks } = useLinks()
  const { refactorHierarchy } = useApi()

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

  // const execRefactor = async (from: RefactorPath, to: RefactorPath, clearBuffer = true) => {
  //   // const refactored = getMockRefactor(from, to, clearBuffer)

  //   const nodeId = getNodeidFromPath(from.path, from.namespaceID)
  //   const data = await api
  //     .refactorHeirarchy({ path: from.path.split('.').join('#') }, { path: to.path.split('.').join('#') }, nodeId)
  //     .then((response) => {
  //       return response
  //     })

  //   return data
  // }

  const execRefactorAsync = async (from: RefactorPath, to: RefactorPath, clearBuffer = true) => {
    mog('REFACTOR: FROM < TO', { from, to })
    const nodeID = getNodeidFromPath(from.path, from.namespaceID)
    const res = await refactorHierarchy(
      { path: from.path.split('.').join('#'), namespaceID: from.namespaceID },
      { path: to.path.split('.').join('#'), namespaceID: to.namespaceID ?? from.namespaceID },
      nodeID
    ).then((response: RefactorResponse) => {
      const addedILinks: ILink[] = []
      const removedILinks: ILink[] = []

      Object.entries(response.changedPaths).forEach(([nsId, nsObject]) => {
          nsObject.addedPaths.forEach((ilink) => {
            ilink.namespace = nsId
          })
          nsObject.removedPaths.forEach((ilink) => {
            ilink.namespace = nsId
          })
        addedILinks.push(...nsObject.addedPaths)
        removedILinks.push(...nsObject.removedPaths)
      })
      const refactored = updateILinks(addedILinks, removedILinks)
      return refactored
    })

    return res
  }

  return { getMockRefactor, execRefactorAsync }
}

// DO NOT DELETE. FOR REFERENCE
// // Used to wrap a class component to provide hooks
// export const withRefactor = (Component: any) => {
//   return function C2(props: any) {
//     const { getMockRefactor, execRefactor } = useRefactor()

//     const prefillRefactorModal = useRefactorStore((state) => state.prefillModal)

//     return (
//       <Component
//         getMockRefactor={getMockRefactor}
//         execRefactor={execRefactor}
//         prefillRefactorModal={prefillRefactorModal}
//         {...props}
//       />
//     )
//   }
// }
