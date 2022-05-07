import { mog } from '@mexit/core'
import { get, set } from 'idb-keyval'

import { DefaultPersistentData } from '../Data/baseData'
import { PersistentData } from './../Types/Data'

export const keys = [
  'baseNodeId',
  'ilinks',
  'tags',
  'contents',
  'linkCache',
  'tagsCache',
  'archive',
  'bookmarks',
  'todos',
  'reminders',
  'snippets'
]

export const useIndexedDBData = () => {
  const getPersistedData = async (): Promise<any> => {
    const res = {}

    for (const key of keys) {
      let val = await get(key)

      if (!val) {
        mog('Value Not Found in IDB', { key })
        val = DefaultPersistentData[key]
      } else {
        mog('Value Found in IDB', { key })
      }
      res[key] = val
    }
    return res
  }

  const persistData = (data: PersistentData) => {
    Object.entries(data).forEach(async ([key, value]) => {
      await set(key, value)
    })
  }

  return { getPersistedData, persistData }
}
