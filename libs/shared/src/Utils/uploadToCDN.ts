import { client } from '@workduck-io/dwindle'
import Compress from 'compress.js'

import { apiURLs } from '@mexit/core'

import toast from 'react-hot-toast'

export const uploadImageToWDCDN = async (data: string | ArrayBuffer): Promise<string | ArrayBuffer> => {
  if (typeof data === 'string') {
    try {
      const compress = new Compress()
      const parsedImage = data.split(',')[1]

      const file = Compress.convertBase64ToFile(parsedImage)
      const compressedImg = (
        await compress.compress([file], {
          size: 4,
          quality: 0.9
        })
      )[0]

      toast('Uploading image')
      const resp = await client.post(apiURLs.createImageLink, {
        encodedString: compressedImg.data
      })
      const path = (await resp.data) as string
      toast('Image Uploaded')
      return apiURLs.getImagePublicLink(path)
    } catch (error) {
      toast('Image Upload Failed :(')
      return data
    }
  } else {
    return data
  }
}
