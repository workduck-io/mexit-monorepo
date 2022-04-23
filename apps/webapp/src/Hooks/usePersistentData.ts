import { mog } from '@mexit/core';
import { get, set } from 'idb-keyval';

import { DefaultPersistentData } from '../Data/baseData';
import { PersistentData } from './../Types/Data';

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
    const getPersistedData = async () => {
        const res = DefaultPersistentData

        keys.forEach(async (key) => {
            let val = await get(key);

            if (!val) {
                val = DefaultPersistentData[key]
            }
            res[key] = val
        })

        return res
    }

    const persistData = (data: PersistentData) => {
        Object.entries(data).forEach(async ([key, value]) => {
            set(key, value)
        })
    }

    return { getPersistedData, persistData }
}


