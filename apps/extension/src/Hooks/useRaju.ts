import { idxKey, mog } from '@mexit/core'

import { useSputlitStore } from '../Stores/useSputlitStore'

export interface ParentMethods {
  SEARCH: (key: idxKey | idxKey[], query: string) => Promise<any>
  UPLOAD_IMAGE_TO_S3: (base64string: string) => Promise<string>
}

// Ref: https://stackoverflow.com/a/53039092/13011527
type ArgumentsType<T extends (...args: any[]) => any> = T extends (...args: infer A) => any ? A : never

// Raju is great with doing Hera Pheri
// He doesn't carry out things on his own, but tells people what to do and when
// e.g. watch his scene when negotiating with taxi driver and construction worker to understand what useRaju does
// Also see Chotu

export default function useRaju() {
  const dispatch = <K extends keyof ParentMethods>(
    type: K,
    ...params: ArgumentsType<ParentMethods[K]>
  ): ReturnType<ParentMethods[K]> => {
    const child = useSputlitStore.getState().child

    switch (type) {
      case 'SEARCH':
        return child
          .search(...params)
          .then((result) => {
            return result
          })
          .catch((err) => {
            mog('[SEARCH]: Unable to search with', { err })
          })
      case 'UPLOAD_IMAGE_TO_S3': {
        return child
          .uploadImageToS3Dwindle(...params)
          .then((result) => {
            mog('UploadImageToS3', { result })
            return result
          })
          .catch((err) => {
            mog('[IMAGE UPLOAD]: Failed!', { err })
          })
      }
      default: {
        mog('REQUEST FOR', { type })
      }
    }
  }

  return {
    dispatch
  }
}
