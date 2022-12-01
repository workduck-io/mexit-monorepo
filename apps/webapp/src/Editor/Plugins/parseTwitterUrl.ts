import { mog } from '@mexit/core'

import { MediaPlugin } from '@udecode/plate'
import { getPluginOptions, PlateEditor, RenderFunction, Value } from '@udecode/plate-core'

const twitterRegex = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(?<id>\d+)/

export const parseTwitterUrl = (url: string): EmbedUrlData | undefined => {
  mog('URL IS', { url })
  if (url?.match(twitterRegex)) {
    return {
      provider: 'twitter',
      id: twitterRegex.exec(url)?.groups?.id,
      url
    }
  }
}

export type EmbedUrlData = {
  url?: string
  provider?: string
  id?: string
  component?: RenderFunction<EmbedUrlData>
}

export const parseMediaUrl = <V extends Value>(
  editor: PlateEditor<V>,
  {
    pluginKey,
    url
  }: {
    pluginKey: string
    url: string
  }
): EmbedUrlData => {
  const { rules } = getPluginOptions<MediaPlugin, V>(editor, pluginKey)
  if (!rules) return { url }

  for (const { parser, component } of rules) {
    const parsed = parser(url)
    if (parsed) {
      return { ...parsed, component }
    }
  }

  return { url }
}
