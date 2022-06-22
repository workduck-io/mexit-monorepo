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
      resultTags.push({ value: appName })
      if (splitURL[3]) resultTags.push({ value: `${splitURL[3]}` })
      if (splitURL[4]) resultTags.push({ value: `${splitURL[4]}` })
      if (keyword === 'pulls') resultTags.push({ value: 'PR' })
      else if (keyword === 'issues') resultTags.push({ value: `ISSUE${splitURL[6] ? '-' + splitURL[6] : 'S'}` })
      else if (keyword === 'pull' && splitURL[6]) resultTags.push({ value: `PR-${splitURL[6]}` })
      else if (keyword === 'projects') resultTags.push({ value: matchedMetaTags.value })
      return resultTags
    case 'linear':
      resultTags.push({ value: appName })

      if (splitURL[3]) resultTags.push({ value: `${splitURL[3]}` })
      if (keyword === 'issue') {
        resultTags.push({ value: 'issue' })
        resultTags.push({ value: `${splitURL[5]}` })
      }
      if (keyword === 'views') resultTags.push({ value: `${splitURL[4]}` })
      if (keyword === 'view') resultTags.push({ value: 'view' })
      if (keyword === 'team') {
        resultTags.push({ value: 'team' })
        resultTags.push({ value: `${splitURL[6]}` })
        if (splitURL[7]) resultTags.push({ value: `${splitURL[7]}` })
      }

      return resultTags
    case 'gmeet':
      resultTags.push({ value: 'Google Meet' })

      if (titleAsTag) resultTags.push({ value: matchedMetaTags.value.toString().split('–')[1] })
      return resultTags
    case 'gmail':
      resultTags.push({ value: 'Gmail' })
      if (titleAsTag) resultTags.push({ value: matchedMetaTags.value.toString().split(' ')[0] })
      return resultTags
    case 'slack':
      resultTags.push({ value: 'Slack' })
      if (titleAsTag) {
        resultTags.push({ value: matchedMetaTags.value.toString().split('|')[1] })
        resultTags.push({ value: matchedMetaTags.value.toString().split('|')[2] })
      }
      return resultTags
    case 'airtable':
      resultTags.push({ value: 'Airtable' })
      if (titleAsTag) {
        resultTags.push({ value: matchedMetaTags.value.toString().split(' ')[0].split(':')[0] })
        resultTags.push({ value: matchedMetaTags.value.toString().split(' ')[1] })
      }
      return resultTags
    case 'figma':
      resultTags.push({ value: 'Figma' })
      if (titleAsTag) {
        resultTags.push({ value: matchedMetaTags.value.toString().split('–')[0] })
      }
      return resultTags
    case 'atlassian':
      if (titleAsTag) {
        resultTags.push({ value: matchedMetaTags.value.toString().split('-')[0] })
        resultTags.push({ value: matchedMetaTags.value.toString().split('-')[1] })
        resultTags.push({ value: matchedMetaTags.value.toString().split('-')[2] })
      }
      return resultTags
    case 'docs':
      resultTags.push({ value: 'Google Docs' })
      if (titleAsTag) {
        resultTags.push({ value: matchedMetaTags.value.toString().split('-')[0] })
      }
      return resultTags
    case 'sheets':
      resultTags.push({ value: 'Google Sheets' })
      if (titleAsTag) {
        resultTags.push({ value: matchedMetaTags.value.toString().split('-')[0] })
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
