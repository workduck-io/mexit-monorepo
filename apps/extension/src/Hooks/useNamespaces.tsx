import { ILink, MIcon, NodeType, RESERVED_NAMESPACES, SHARED_NAMESPACE, SingleNamespace, useDataStore } from '@mexit/core'

import { useNodes } from './useNodes'

export const useNamespaces = () => {
  const namespaces = useDataStore((state) => state.namespaces)
  const { getNode, getNodeType } = useNodes()

  const getNamespace = (id: string): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const namespace = namespaces.find((ns) => ns.id === id)
    if (namespace) return namespace
    if (id === SHARED_NAMESPACE.id) return SHARED_NAMESPACE
    return undefined
  }

  const getNamespaceOptions = () => {
    const namespaces = useDataStore.getState().namespaces.map((n) => ({
      ...n,
      value: n.name,
      label: n.name
    }))
    const defaultNamespace = getDefaultNamespace() ?? namespaces[0]
    return {
      namespaces,
      defaultNamespace: defaultNamespace
        ? {
            ...defaultNamespace,
            value: defaultNamespace.name,
            label: defaultNamespace.name
          }
        : undefined
    }
  }

  const getNamespaceOfNode = (nodeId: string): SingleNamespace | undefined => {
    const node = getNode(nodeId, true)
    const namespace = namespaces.find((ns) => ns.id === node?.namespace)
    if (namespace) return namespace
    const nodeType = getNodeType(nodeId)
    if (nodeType === NodeType.SHARED) {
      return SHARED_NAMESPACE
    }
  }

  const getNamespaceIcon = (namespace: SingleNamespace): MIcon => {
    return (
      namespace.icon ?? {
        type: 'ICON',
        value:
          namespace.name === RESERVED_NAMESPACES.default
            ? 'ri:user-line'
            : namespace.name === RESERVED_NAMESPACES.shared
            ? 'ri:share-line'
            : 'heroicons-outline:view-grid'
      }
    )
  }

  const getNamespaceIconForNode = (nodeId: string): MIcon | undefined => {
    const node = getNode(nodeId)
    const namespace = namespaces.find((ns) => ns.id === node?.namespace)
    if (namespace) return getNamespaceIcon(namespace)

    const nodeType = getNodeType(nodeId)
    if (nodeType === NodeType.SHARED) {
      return {
        type: 'ICON',
        value: 'ri:share-line'
      }
    }
  }

  const getNodesOfNamespace = (id: string): ILink[] => {
    const ilinks = useDataStore.getState().ilinks
    return ilinks.filter((l) => l.namespace === id)
  }

  const getDefaultNamespace = (): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const namespace = namespaces.find((ns) => ns.name === RESERVED_NAMESPACES.default)
    return namespace
  }

  const getDefaultNamespaceId = (): string | undefined => {
    const namespace = getDefaultNamespace()
    return namespace?.id
  }

  const getNodesByNamespaces = () => {
    const ilinks = useDataStore.getState().ilinks
    const namespaces = useDataStore.getState().namespaces
    const nodesByNamespace = namespaces.map((ns) => ({ ...ns, nodes: ilinks.filter((l) => l.namespace === ns.id) }))
    return nodesByNamespace
  }

  const getNamespaceOfNodeid = (nodeid: string): SingleNamespace | undefined => {
    const namespaces = useDataStore.getState().namespaces
    const ilinks = useDataStore.getState().ilinks
    const namespace = ilinks.find((l) => l.nodeid === nodeid)?.namespace
    if (namespace) {
      const ns = namespaces.find((ns) => ns.id === namespace)
      return ns
    }
    const nodeType = getNodeType(nodeid)

    if (nodeType === NodeType.SHARED) {
      return SHARED_NAMESPACE
    }
  }

  return {
    getNamespace,
    getNodesOfNamespace,
    getDefaultNamespace,
    getDefaultNamespaceId,
    getNamespaceOfNodeid,
    getNodesByNamespaces,
    getNamespaceIcon,
    getNamespaceIconForNode,
    getNamespaceOfNode,
    getNamespaceOptions
  }
}
