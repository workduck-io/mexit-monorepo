// import { createStore, del, get, set } from 'idb-keyval'

import { IDBPDatabase, openDB } from 'idb'

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
    const result = await store.getAll()
    mog('Get All Data', { result })
    return result
  }

  async putValue(tableName: string, key: string, value: string) {
    const tx = this.db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)

    const result = await store.put(value, key)
    mog('Put Data ', { result })
    return result
  }

  async putBulkValue(tableName: string, values: object[]) {
    const tx = this.db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    for (const value of values) {
      const result = await store.put(value)
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
