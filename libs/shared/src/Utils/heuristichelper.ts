import { Tag } from '../Types/Editor'
import { nanoid } from 'nanoid'

interface SitesMetadata {
  appName?: string
  baseUrl: string
  metaTags: string[]
  keywords?: string[]
  titleAsTag?: boolean
}

export const sitesMetadataDict: SitesMetadata[] = [
  {
    appName: 'linear',
    baseUrl: 'https://linear.app/',
    metaTags: ['title'],
    keywords: ['issue', 'views', 'team', 'view']
  },
  {
    appName: 'gmeet',
    baseUrl: 'https://meet.google.com/',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'github',
    baseUrl: 'https://github.com/',
    metaTags: ['title'],
    keywords: ['pulls', 'pull', 'issues', 'issue', 'projects']
  },
  {
    appName: 'gmail',
    baseUrl: 'https://mail.google.com/',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'slack',
    baseUrl: 'https://app.slack.com/',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'airtable',
    baseUrl: 'https://airtable.com/',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'figma',
    baseUrl: 'https://www.figma.com/',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'atlassian',
    baseUrl: 'atlassian.net',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'docs',
    baseUrl: 'https://docs.google.com/document',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  },
  {
    appName: 'sheets',
    baseUrl: 'https://docs.google.com/spreadsheets',
    metaTags: ['title'],
    keywords: [],
    titleAsTag: true
  }
]

export const CreateTags = (
  appName: string,
  appUrl: string,
  keyword?: string,
  matchedMetaTags?: any,
  titleAsTag?: boolean
): any[] => {
  const splitURL = appUrl.split('/')
  const resultTags: Tag[] = []
  switch (appName) {
    case 'github':
      resultTags.push({ id: nanoid(), text: appName })
      if (splitURL[3]) resultTags.push({ id: nanoid(), text: `${splitURL[3]}` })
      if (splitURL[4]) resultTags.push({ id: nanoid(), text: `${splitURL[4]}` })
      if (keyword === 'pulls') resultTags.push({ id: nanoid(), text: 'PR' })
      else if (keyword === 'issues')
        resultTags.push({ id: nanoid(), text: `ISSUE${splitURL[6] ? '-' + splitURL[6] : 'S'}` })
      else if (keyword === 'pull' && splitURL[6]) resultTags.push({ id: nanoid(), text: `PR-${splitURL[6]}` })
      else if (keyword === 'projects') resultTags.push({ id: nanoid(), text: matchedMetaTags.value })
      return resultTags
    case 'linear':
      resultTags.push({ id: nanoid(), text: appName })

      if (splitURL[3]) resultTags.push({ id: nanoid(), text: `${splitURL[3]}` })
      if (keyword === 'issue') {
        resultTags.push({ id: nanoid(), text: 'issue' })
        resultTags.push({ id: nanoid(), text: `${splitURL[5]}` })
      }
      if (keyword === 'views') resultTags.push({ id: nanoid(), text: `${splitURL[4]}` })
      if (keyword === 'view') resultTags.push({ id: nanoid(), text: 'view' })
      if (keyword === 'team') {
        resultTags.push({ id: nanoid(), text: 'team' })
        resultTags.push({ id: nanoid(), text: `${splitURL[6]}` })
        if (splitURL[7]) resultTags.push({ id: nanoid(), text: `${splitURL[7]}` })
      }

      return resultTags
    case 'gmeet':
      resultTags.push({ id: nanoid(), text: 'Google Meet' })

      if (titleAsTag) resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('–')[1] })
      return resultTags
    case 'gmail':
      resultTags.push({ id: nanoid(), text: 'Gmail' })
      if (titleAsTag) resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split(' ')[0] })
      return resultTags
    case 'slack':
      resultTags.push({ id: nanoid(), text: 'Slack' })
      if (titleAsTag) {
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('|')[1] })
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('|')[2] })
      }
      return resultTags
    case 'airtable':
      resultTags.push({ id: nanoid(), text: 'Airtable' })
      if (titleAsTag) {
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split(' ')[0].split(':')[0] })
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split(' ')[1] })
      }
      return resultTags
    case 'figma':
      resultTags.push({ id: nanoid(), text: 'Figma' })
      if (titleAsTag) {
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('–')[0] })
      }
      return resultTags
    case 'atlassian':
      if (titleAsTag) {
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('-')[0] })
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('-')[1] })
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('-')[2] })
      }
      return resultTags
    case 'docs':
      resultTags.push({ id: nanoid(), text: 'Google Docs' })
      if (titleAsTag) {
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('-')[0] })
      }
      return resultTags
    case 'sheets':
      resultTags.push({ id: nanoid(), text: 'Google Sheets' })
      if (titleAsTag) {
        resultTags.push({ id: nanoid(), text: matchedMetaTags.value.toString().split('-')[0] })
      }
      return resultTags

    default:
      return resultTags
  }
}

export const CreateAlias = (appName: string, tag?: { name: string; value: any }) => {
  switch (appName) {
    case 'github':
      if (tag.name === 'title') {
        return tag.value
      }
      return
    case 'linear':
      if (tag.name === 'title') {
        return tag.value
      }
      return
    case 'slack':
      if (tag.name === 'title') {
        return tag.value
      }
      return
    default:
      return tag.value
  }
}
