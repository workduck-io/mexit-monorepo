import { ILink, NodeLink } from '@mexit/core'
import { useLinks } from '@mexit/shared'

interface NamespaceChangedPaths {
  removedPaths: ILink[]
  addedPaths: ILink[]
}

export interface RefactorResponse {
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

  const { updateILinks } = useLinks()

  const execRefactorFromResponse = (data: RefactorResponse) => {
    const addedILinks: ILink[] = []
    const removedILinks: ILink[] = []

    Object.entries(data.changedPaths).forEach(([nsId, nsObject]) => {
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
  }

  return { execRefactorFromResponse }
}
