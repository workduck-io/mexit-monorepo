import { WebClient, LogLevel } from '@slack/web-api'
import axios from 'axios'
import fs, { createReadStream } from 'fs'

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG
})

const fileName = fs.readdirSync('./dist/apps/extension').filter((file) => file.endsWith('.zip'))[0]
const filePath = `./dist/apps/extension/${fileName}`
const channelId = process.env.SLACK_CHANNEL_ID

axios
  .get('https://api.github.com/repos/workduck-io/mexit-monorepo/releases/latest', {
    headers: {
      Authorization: `token ${process.env.YARN_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })
  .then(async ({ data }) => {
    const body = data.body
    try {
      const result = await client.files.upload({
        channels: channelId,
        initial_comment: body,
        file: createReadStream(filePath)
      })
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  })
