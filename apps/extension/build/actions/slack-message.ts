import { LogLevel, WebClient } from '@slack/web-api'
import parseChangelog from 'changelog-parser'
import fs, { createReadStream } from 'fs'
import got from 'got'

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG
})

const getAllCommits = async () => {
  const result: any[] = await got
    .get(' https://api.github.com/repos/workduck-io/mexit-monorepo/commits', {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    })
    .json()
  const map = {}
  result.forEach((commit) => {
    map[commit['sha'].substring(0, 8)] = commit
  })

  return map
}

const getURLFromCommit = (commit) => {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g
  return commit.commit.message.match(urlRegex)
}
const fileName = fs.readdirSync('./dist/extension').filter((file) => file.endsWith('.zip'))[0]
const filePath = `./dist/extension/${fileName}`
const channelId = process.env.SLACK_CHANNEL_ID

const changeLogPath = (appName: string) => `apps/${appName}/CHANGELOG.md`.toLowerCase()

const generateChangelog = async (appName: string) => {
  const path = changeLogPath(appName)
  const changelog = await parseChangelog(path)

  const commits = await getAllCommits()

  const latestRelease = changelog.versions[1]
  let result = `## ${appName} - ${latestRelease.version}\n`
  latestRelease.parsed['_'].forEach((v) => {
    const [commitID, clText] = v.split(':')
    const commit = commits[commitID]
    const url = getURLFromCommit(commit)
    const text = `*${clText} by @${commit.author.login}` + (url ? ` in ${url}` : '')
    result += text
  })
  return result
}

async function main() {
  const changelog =
    (await generateChangelog('Webapp')) +
    '\n\n' +
    (await generateChangelog('Extension')) +
    '\n\n' +
    `Extension URL: https://chrome.google.com/webstore/detail/mexit/${process.env.CHROME_EXTENSION_ID}`

  const result = await client.files.upload({
    channels: channelId,
    initial_comment: changelog,
    file: createReadStream(filePath)
  })
  return result
}
main()
  .then((result) => console.log('Slack upload successful:  ', result))
  .catch((err) => console.error('Threw error: ', err))
