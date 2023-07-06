export enum SocketActionType {
  CONTENT_UPDATE = 'CONTENT_UPDATE',
  ROUTE_CHANGE = 'ROUTE_CHANGE',
  CURSOR_LOCATION_CHANGE = 'CURSOR_LOCATION_CHANGE',
  EDITING_STATUS = 'EDITING_STATUS',
  USER_LIST_UPDATE = 'USER_LIST_UPDATE',
  PROPERTY_UPDATE = 'PROPERTY_UPDATE'
}

export type EntityType =
  | 'HIGHLIGHT'
  | 'NOTE'
  | 'CAPTURE'
  | 'NAMESPACE'
  | 'PROMPT'
  | 'SNIPPET'
  | 'LINK'
  | 'USER'
  | 'VIEW'
  | 'WORKSPACE'

export interface UpdateData {
  operationType: 'CREATE' | 'UPDATE' | 'DELETE'
  entityType: EntityType
  entityId: string

  payload?: any
}

export type UpdateKey = `${EntityType}-${UpdateData['operationType']}`

export interface SocketMessage {
  action: SocketActionType
  data: UpdateData
}
