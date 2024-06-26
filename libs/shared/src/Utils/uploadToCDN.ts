import toast from 'react-hot-toast'

import Compress from 'compress.js'

import { mog } from '@mexit/core'

interface CompressOptions {
  quality?: number | undefined
  size?: number | undefined
  maxWidth?: number | undefined
  maxHeight?: number | undefined
  resize?: boolean | undefined
}

export type UploadImageFn = (data: string | ArrayBuffer) => Promise<string | ArrayBuffer>

export const useUploadToCDN = (uploader: (base64string: string, options?: any) => Promise<string>) => {
  const uploadImageToWDCDN = async (data: string, compressOptions: CompressOptions = {}): Promise<string> => {
    // mog('uploadImageToWDCDN', { data, tp: typeof data })
    if (typeof data === 'string') {
      try {
        const compress = new Compress()
        const parsedImage = data.split(',')[1]

        const file = Compress.convertBase64ToFile(parsedImage)
        const compressedImg = (
          await compress.compress([file], {
            size: 4,
            quality: 0.9,
            ...compressOptions
          })
        )[0]

        toast('Uploading image')
        // mog('uploadImageToWDCDN', { compressedImg })
        const resp = await uploader(`${compressedImg.prefix}${compressedImg.data}`, {
          giveCloudFrontURL: true,
          parseBase64String: true
        })
        const path = resp as string
        toast('Image Uploaded')

        mog('image', {
          path
        })
        return path
      } catch (error) {
        toast('Image Upload Failed :(')
        console.error('uploadImageToWDCDN', { error })
        return data
      }
    } else {
      return data
    }
  }

  return { uploadImageToWDCDN }
}
