import { ELEMENT_ILINK } from '@workduck-io/mex-editor'

type ExcludeFromTextType = {
  types?: Set<string>
  fields?: Set<ExcludeFieldTypes>
}

type ExcludeFieldTypes = 'value' | 'url' | 'text'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (
  content: any[],
  join?: string,
  exclude: ExcludeFromTextType = {
    types: new Set([
      // ELEMENT_EXCALIDRAW,
      ELEMENT_ILINK
      // ELEMENT_INLINE_BLOCK
    ])
  }
): string => {
  const text: string[] = []

  content?.forEach((n) => {
    if (exclude?.types?.has(n.type)) return

    if (n.text && !exclude?.fields?.has('text') && n.text !== '') text.push(n.text)

    // * Extract custom components (ILink, Tags, etc) `value` field
    if (n.value && !exclude?.fields?.has('value') && n.value !== '') text.push(n.value)

    // * Extract custom components (Webem, Links) `url` field
    if (n.url && !exclude?.fields?.has('url') && n.url !== '') text.push(n.url)

    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '', exclude)
      text.push(childText)
    }
  })

  const rawText = text.join(join ?? '')
  return rawText
}
