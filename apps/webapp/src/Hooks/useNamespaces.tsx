import {
  SingleNamespace,
  NodeType,
  MIcon,
  ILink,
  mog,
  SHARED_NAMESPACE,
  RESERVED_NAMESPACES,
  getNewNamespaceName,
  Mentionable
} from '@mexit/core'
import { useAuthStore } from '../Stores/useAuth'

import { useDataStore } from '../Stores/useDataStore'
import { useMentionStore } from '../Stores/useMentionsStore'
import { useNamespaceApi } from './API/useNamespaceAPI'
import { useNodes } from './useNodes'

export const useNamespaces = () => {
  const namespaces = useDataStore((state) => state.namespaces)
  const { createNewNamespace } = useNamespaceApi()
  const { getNode, getNodeType } = useNodes()
  const addNamespace = useDataStore((s) => s.addNamespace)
  const { changeNamespaceName: chageNamespaceNameApi, changeNamespaceIcon: changeNamespaceIconApi } = useNamespaceApi()

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
      value: n.id,
      label: n.name
    }))
    const defaultNamespace = getDefaultNamespace() ?? namespaces[0]
    return {
      namespaces,
      defaultNamespace: defaultNamespace
        ? {
            ...defaultNamespace,
            value: defaultNamespace.id,
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

  const getNodesOfNamespace = (namespaceId: string): ILink[] => {
    const ilinks = useDataStore.getState().ilinks
    return ilinks.filter((l) => l.namespace === namespaceId)
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

  const addDefaultNewNamespace = async () => {
    const namespaces = useDataStore.getState().namespaces
    const newNamespaceName = getNewNamespaceName(namespaces.length)
    return await addNewNamespace(newNamespaceName)
  }

  const addNewNamespace = async (name: string) => {
    const ns = await createNewNamespace(name)
    if (ns) addNamespace(ns)

    mog('New namespace created', { ns })
    return ns
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

  const changeNamespaceName = (id: string, name: string) => {
    chageNamespaceNameApi(id, name)
      .then((res) => {
        if (res) {
          const namespaces = useDataStore.getState().namespaces
          const newNamespaces = namespaces.map((n) =>
            n.id === id
              ? {
                  ...n,
                  name,
                  updatedAt: Date.now()
                }
              : n
          )
          useDataStore.setState({ namespaces: newNamespaces })
        }
      })
      .catch((err) => {
        console.log('Error changing namespace name', err)
      })
  }

  const changeNamespaceIcon = async (id: string, name: string, icon: MIcon) => {
    // Lets change the icon in hope that it changes
    const namespaces = useDataStore.getState().namespaces
    const namespace = namespaces.find((n) => n.id === id)
    const oldIcon = { ...namespace }.icon
    const newNamespaces = namespaces.map((n) =>
      n.id === id
        ? {
            ...n,
            icon,
            updatedAt: Date.now()
          }
        : n
    )
    useDataStore.setState({ namespaces: newNamespaces })

    await changeNamespaceIconApi(id, name, icon).catch((err) => {
      console.log('Error changing namespace icon', err)
      // We revert the icon
      const namespaces = useDataStore.getState().namespaces
      const newNamespaces = namespaces.map((n) =>
        n.id === id
          ? {
              ...n,
              icon: oldIcon,
              updatedAt: Date.now()
            }
          : n
      )
      useDataStore.setState({ namespaces: newNamespaces })
    })
  }

  const getSharedUsersForNamespace = (namespaceId: string): Mentionable[] => {
    const mentionable = useMentionStore.getState().mentionable
    const namespace = getNamespace(namespaceId)
    const isNamespaceShared = !!namespace.granterID
    const users = mentionable
      .filter((mention) => mention.access.space[namespaceId] !== undefined)
      // Get the owner to the top
      .sort((a, b) => (a.access.space[namespaceId] === 'OWNER' ? -1 : b.access.space[namespaceId] === 'OWNER' ? 1 : 0))

    const currentUser = useAuthStore.getState().userDetails
    // const sharedNodes = useDataStore.getState().sharedNodes

    if (!isNamespaceShared) {
      const curUser: Mentionable = {
        type: 'mentionable',
        access: { note: {}, space: { [namespaceId]: 'OWNER' } },
        email: currentUser.email,
        name: currentUser.name,
        alias: currentUser.alias,
        userID: currentUser.userID
      }
      return [curUser, ...users]
    }

    mog('Getting shared users for namespace', { namespaceId, users })
    return users
  }

  const isNamespacePublic = (namespaceId: string): boolean => {
    const namespace = getNamespace(namespaceId)
    return namespace?.publicAccess ?? false
  }

  return {
    getNamespace,
    getNodesOfNamespace,
    getDefaultNamespace,
    getDefaultNamespaceId,
    addNewNamespace,
    getNamespaceOfNodeid,
    getNodesByNamespaces,
    changeNamespaceName,
    changeNamespaceIcon,
    getNamespaceIcon,
    getNamespaceIconForNode,
    addDefaultNewNamespace,
    getNamespaceOfNode,
    getNamespaceOptions,
    // Sharing
    getSharedUsersForNamespace,
    isNamespacePublic
  }
}
