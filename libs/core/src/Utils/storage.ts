// import { createStore, del, get, set } from 'idb-keyval'

import { IDBPDatabase, openDB } from 'idb'

import { S3FileDownloadClient, S3FileUploadClient } from '@workduck-io/dwindle'

import { mog } from './mog'

export const getLocalStorage = () => {
  return typeof window !== 'undefined' ? window.localStorage : null
}

let instance: BackupStorageClass | null = null

class BackupStorageClass {
  private database: string
  private db: IDBPDatabase

  constructor(database: string) {
    this.database = database

    if (instance) {
      throw new Error('New instance cannot be created!!')
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }

  async createObjectStore(tableNames: string[]) {
    try {
      this.db = await openDB(this.database, 1, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue
            }
            db.createObjectStore(tableName)
          }
        }
      })
    } catch (error) {
      return false
    }
  }

  async getValue(tableName: string, key: string) {
    const tx = this.db.transaction(tableName, 'readonly')
    const store = tx.objectStore(tableName)
    const result = await store.get(key)

    mog('Get Data ', { result })
    return result
  }

  async getAllValue(tableName: string) {
    const tx = this.db.transaction(tableName, 'readonly')
    const store = tx.objectStore(tableName)

    // Because of using out-of-line keys, we need both the keys and values
    // when putting all the values back from remote
    const result = []
    await store.openCursor().then(async function logItems(cursor) {
      if (!cursor) {
        return
      }

      result.push({ key: cursor.primaryKey, value: cursor.value })

      await cursor.continue().then(logItems)
    })

    result.push({ key: 'timestamp', value: Date.now().toString() })
    mog('all value', { result })
    return result
  }

  async putValue(tableName: string, key: string, value: string) {
    try {
      const tx = this.db.transaction(tableName, 'readwrite')
      const store = tx.objectStore(tableName)

      const result = await store.put(value, key)
      mog('Put Data ', { result })
      return result
    } catch (error) {
      mog('error', { error })
    }
  }

  async backUpToS3(tableName: string) {
    const result = await this.getAllValue(tableName)
    return await S3FileUploadClient(JSON.stringify(result), {
      fileName: `WORKSPACE_BACKUP_${tableName}`
    })
  }

  async fetchFromS3(tableName: string) {
    return await S3FileDownloadClient({
      fileName: `WORKSPACE_BACKUP_${tableName}`
    })
  }

  async putBulkValue(tableName: string, values: any[]) {
    const tx = this.db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    for (const object of values) {
      const result = await store.put(object.value, object.key)
      mog('Put Bulk Data ', { result })
    }
    return this.getAllValue(tableName)
  }

  async deleteValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    const result = await store.get(id)
    if (!result) {
      mog('Id not found', { id })
      return result
    }
    await store.delete(id)
    mog('Deleted Data', { id })
    return id
  }
}

export const BackupStorage = new BackupStorageClass('mexit-backup')
