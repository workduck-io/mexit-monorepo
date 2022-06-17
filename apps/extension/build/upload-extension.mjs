import chromeWebstoreUpload from 'chrome-webstore-upload'
import fs from 'fs'

const store = chromeWebstoreUpload({
  extensionId: process.env.CHROME_EXTENSION_ID,
  clientId: process.env.CHROME_CLIENT_ID,
  clientSecret: process.env.CHROME_CLIENT_SECRET,
  refreshToken: process.env.CHROME_REFRESH_TOKEN
})

const fileName = fs.readdirSync('./dist/apps/extension').filter((file) => file.endsWith('.zip'))[0]

const extZipFile = fs.createReadStream(`./dist/apps/extension/${fileName}`)

console.log('Uploading Extension with Filename: ', fileName)
store
  .uploadExisting(extZipFile)
  .then((res) => {
    console.log('Uploaded To Chrome Web Store: ', res)
  })
  .catch((error) => {
    console.error('Could Not Upload Extension with Error: ', error)
  })
