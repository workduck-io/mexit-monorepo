/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ActionGroup {
  actionGroupId: string
  name: string
  description: string
  icon: string
  permissions: string
  globalActionId?: string
  authConfig: any
  tag: string
}

export type ActionGroupType = ActionGroup & { connected?: boolean }

export type PortalType = {
  serviceId: string
  serviceType: string
  mexId?: string
  nodeId?: string
  parentNodeId?: string
  sessionStartTime?: number
}
