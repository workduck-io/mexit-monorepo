export enum DrawerType {
  ADD_TO_NOTE = 'ADD TO NOTE',
  LINKED_NOTES = 'LINKED NOTES',
  LOADING = 'LOADING'
}

export type Drawer = {
  type: DrawerType
  data?: any
}
