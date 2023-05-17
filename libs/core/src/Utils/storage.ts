// import { createStore, del, get, set } from 'idb-keyval'

import { IDBPDatabase, openDB } from 'idb'

export const getLocalStorage = () => {
  return typeof window !== 'undefined' ? window.localStorage : null
}

let instance: BackupStorageClass
export class BackupStorageClass {
  private db: IDBPDatabase
  private storeName

  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }

  async openDatabase(): Promise<void> {
    this.db = await openDB('mexit-backup', this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(this.objectStoreName)) {
          const objectStore = db.createObjectStore(this.objectStoreName, { keyPath: 'id' })
          objectStore.createIndex('by-name', 'name')
        }
      }
    })
  }

  public async closeDB() {
    if (this.db) this.db.close()
  }

  add(item) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readwrite')
      const request = objectStore.add(item)

      request.onsuccess = () => {
        resolve('Item added successfully')
      }

      request.onerror = (event) => {
        reject(`Failed to add item: ${event.target.error}`)
      }
    })
  }

  getItem(id: string) {
    return new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readonly')
      const request = objectStore.get(id)

      request.onsuccess = (event) => {
        const item = event.target.result

        if (item) {
          resolve(item)
        } else {
          reject(`Item with ID '${id}' not found`)
        }
      }

      request.onerror = (event) => {
        reject(`Failed to get item: ${event.target.error}`)
      }
    })
  }
}

export const BackupStorage = new BackupStorageClass()
