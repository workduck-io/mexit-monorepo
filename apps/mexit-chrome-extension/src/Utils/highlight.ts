// TODO: Clean this up
const camel = (a: string): string =>
  a.split('-').reduce((str, s, idx) => str + (idx === 0 ? s : s[0].toUpperCase() + s.slice(1)), '')

export const DATASET_IDENTIFIER = 'highlight-id'
export const DATASET_IDENTIFIER_EXTRA = 'highlight-id-extra'
export const DATASET_SPLIT_TYPE = 'highlight-split-type'
export const CAMEL_DATASET_IDENTIFIER = camel(DATASET_IDENTIFIER)
export const CAMEL_DATASET_IDENTIFIER_EXTRA = camel(DATASET_IDENTIFIER_EXTRA)
export const CAMEL_DATASET_SPLIT_TYPE = camel(DATASET_SPLIT_TYPE)

export interface DomMeta {
  parentTagName: string
  parentIndex: number
  textOffset: number
  extra?: unknown
}

export interface DomNode {
  $node: Node
  offset: number
}
export const ROOT_IDX = -2
export const UNKNOWN_IDX = -1

const countGlobalNodeIndex = ($node: Node, $root: Document | HTMLElement): number => {
  const tagName = ($node as HTMLElement).tagName
  const $list = $root.getElementsByTagName(tagName)

  for (let i = 0; i < $list.length; i++) {
    if ($node === $list[i]) {
      return i
    }
  }

  return UNKNOWN_IDX
}

/**
 * text total length in all predecessors (text nodes) in the root node
 * (without offset in current node)
 */
const getTextPreOffset = ($root: Node, $text: Node): number => {
  const nodeStack: Node[] = [$root]

  let $curNode: Node = null
  let offset = 0

  while (($curNode = nodeStack.pop())) {
    const children = $curNode.childNodes

    for (let i = children.length - 1; i >= 0; i--) {
      nodeStack.push(children[i])
    }

    if ($curNode.nodeType === 3 && $curNode !== $text) {
      offset += $curNode.textContent.length
    } else if ($curNode.nodeType === 3) {
      break
    }
  }

  return offset
}

/**
 * find the original dom parent node (none highlight dom)
 */
const getOriginParent = ($node: HTMLElement | Text): HTMLElement => {
  if ($node instanceof HTMLElement && (!$node.dataset || !$node.dataset[CAMEL_DATASET_IDENTIFIER])) {
    return $node
  }

  let $originParent = $node.parentNode as HTMLElement

  while ($originParent?.dataset[CAMEL_DATASET_IDENTIFIER]) {
    $originParent = $originParent.parentNode as HTMLElement
  }

  return $originParent
}

export const getDomMeta = ($node: HTMLElement | Text, offset: number, $root: Document | HTMLElement): DomMeta => {
  const $originParent = getOriginParent($node)
  const index = $originParent === $root ? ROOT_IDX : countGlobalNodeIndex($originParent, $root)
  const preNodeOffset = getTextPreOffset($originParent, $node)
  const tagName = $originParent.tagName

  return {
    parentTagName: tagName,
    parentIndex: index,
    textOffset: preNodeOffset + offset
  }
}

export const formatDomNode = (n: DomNode): DomNode => {
  if (
    // Text
    n.$node.nodeType === 3 ||
    // CDATASection
    n.$node.nodeType === 4 ||
    // Comment
    n.$node.nodeType === 8
  ) {
    return n
  }

  return {
    $node: n.$node.childNodes[n.offset],
    offset: 0
  }
}
