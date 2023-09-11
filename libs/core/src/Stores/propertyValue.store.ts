import { StoreIdentifier } from '../Types'
import { createStore } from '../Utils/storeCreator'

type PropertyValues = Record<string, string[]>
const initialValue: PropertyValues = {
  priority: ['low', 'medium', 'high'],
  status: ['todo', 'pending', 'completed'],
  stage: ['lead', 'other']
}

const propertyValueStoreConfig = (set, get) => ({
  propertyValues: initialValue,
  clear: () => set({ propertyValues: initialValue }),
  setPropertyValues: (propertyValues: PropertyValues) => {
    set({ propertyValues })
  },
  getPropertyList: () => {
    return Object.keys(get().propertyValues)
  },
  addPropertyValue: (property: string, value: string) => {
    set({
      propertyValues: { ...get().propertyValues, [property]: (get().propertyValues[property] ?? []).concat(value) }
    })
  },
  removePropertyValue: (property: string, value: string) => {
    set({
      propertyValues: {
        ...get().propertyValues,
        [property]: (get().propertyValues[property] ?? []).filter((item) => item !== value)
      }
    })
  },
  removeProperty: (property: string) => {
    const { [property]: propertyToDelete, ...rest } = get().propertyValues
    set({
      propertyValues: rest
    })
  }
})

export const usePropertyValueStore = createStore(propertyValueStoreConfig, StoreIdentifier.PROPERTYVALUE, false)
