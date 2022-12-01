import produce, { setAutoFreeze } from 'immer'
import pipe from 'ramda/es/pipe'
import create, { State, StateCreator } from 'zustand'
import { combine } from 'zustand/middleware'

export const immer =
  <T extends State>(config: StateCreator<T, (fn: (draft: T) => void) => void>): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce(fn) as (state: T) => T), get, api)

export const immerMutable =
  <T extends State>(config: StateCreator<T, (fn: (draft: T) => void) => void>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (fn) => {
        setAutoFreeze(false)
        set(produce(fn) as (state: T) => T)
        setAutoFreeze(true)
      },
      get,
      api
    )

export const combineAndImmer = <PrimaryState extends State>(
  initialState: PrimaryState,
  config: StateCreator<PrimaryState, (fn: (draft: PrimaryState) => void) => void>
): StateCreator<PrimaryState> => {
  return combine(initialState, immer(config))
}

export const createStore = () => pipe(immer, create)

export const action = <T>(draft: T & { actionType?: string }, actionType: string) => {
  draft.actionType = actionType
}

// * --------------------------------------------------------------------------------

export const setStoreValue =
  <T>(
    set: (fn: (draft: T & { actionType?: string; noDiff?: boolean }) => void) => void,
    storeKey: keyof T,
    actionType: string,
    merge?: boolean
  ) =>
  (value: any) => {
    set((state) => {
      state.noDiff = true
      if (state[storeKey] !== value) {
        state.noDiff = false
        state.actionType = actionType
        if (!merge) {
          state[storeKey] = value
        } else {
          state[storeKey] = { ...state[storeKey], ...value }
        }
      }
    })
  }
