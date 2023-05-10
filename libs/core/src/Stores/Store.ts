import { StoreIdentifier } from '../Types'
import { createStore } from '../Utils/storeCreator'

import { recentsStoreConfig } from './recents.store'

let storeInstance: UsersStoreClass

class StoreClass {
  public mapOfStores: Record<string, any>

  constructor(userId?: string) {
    const prefix = userId ? `${userId}-` : ''
    this.mapOfStores = {
      useRecentsStore: createStore(recentsStoreConfig, `${prefix}${StoreIdentifier.RECENTS}`, true)
    }
  }

  get userId() {
    return this.userId
  }
}

class UsersStoreClass {
  public store: StoreClass

  constructor() {
    if (storeInstance) {
      throw new Error('New instance cannot be created!!')
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    storeInstance = this
  }

  setStore(userId: string) {
    this.store = new StoreClass(userId)
  }
}

export const Store = new UsersStoreClass().store.mapOfStores
