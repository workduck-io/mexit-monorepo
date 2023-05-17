import React, { ChangeEvent, useState } from 'react'

import { ImageUploadInput, RelativeContainer } from '../Style/Form'
import { Loading } from '../Style/Loading'
import { useUploadToCDN } from '../Utils/uploadToCDN'

import { IconDisplay } from './IconDisplay'
import { DefaultMIcons } from './Icons'
import { ItemOverlay } from './ItemOverlay'

export const ImageUploader = ({ icon, uploader, onUpload, size }) => {
  const [isLoading, setIsLoading] = useState(false)

  // Compresses image and Shows toasts about upload
  const { uploadImageToWDCDN } = useUploadToCDN(uploader)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      reader.onload = function () {
        const base64String = reader.result as string
        setIsLoading(true)
        uploadImageToWDCDN(base64String)
          .then(onUpload)
          .finally(() => {
            setIsLoading(false)
          })
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <RelativeContainer>
      <IconDisplay icon={icon} size={size ?? 48} />
      <label htmlFor="image-upload">
        <ItemOverlay onHover={!isLoading}>
          {isLoading ? (
            <Loading transparent dots={3} />
          ) : (
            <>
              <IconDisplay icon={DefaultMIcons.EDIT} size={24} />
              <ImageUploadInput
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
            </>
          )}
        </ItemOverlay>
      </label>
    </RelativeContainer>
  )
}
