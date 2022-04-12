import { Tag } from '../Types/Editor'
import { nanoid } from 'nanoid'
export const CreateTags = (appName: string, appUrl: string, keyword?: string, matchedMetaTags?: any): any[] => {
  const splitURL = appUrl.split('/')
  const resultTags: Tag[] = []
  switch (appName) {
    case 'github':
      // default tags
      console.log({ splitURL })

      resultTags.push({ id: nanoid(), text: 'github' })
      if (splitURL[3]) resultTags.push({ id: nanoid(), text: `${splitURL[3]}` })
      if (splitURL[4]) resultTags.push({ id: nanoid(), text: `${splitURL[4]}` })
      if (keyword === 'pulls') resultTags.push({ id: nanoid(), text: 'PR' })
      else if (keyword === 'issues')
        resultTags.push({ id: nanoid(), text: `ISSUE${splitURL[6] ? '-' + splitURL[6] : 'S'}` })
      else if (keyword === 'pull' && splitURL[6]) resultTags.push({ id: nanoid(), text: `PR-${splitURL[6]}` })
      else if (keyword === 'projects') resultTags.push({ id: nanoid(), text: matchedMetaTags.value })
      return resultTags

    default:
      return resultTags
  }
}

export const CreateAlias = (appName: string, tag?: { name: string; value: any }) => {
  switch (appName) {
    case 'github':
      if (tag.name === 'title') return tag.value.split('·')[0]
      return

    default:
      return
  }
}
