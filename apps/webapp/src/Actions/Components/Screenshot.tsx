import { IconButton } from '@mexit/shared'
import { Button } from '@workduck-io/mex-components'
import React, { useRef, useState } from 'react'
import imageEditFill from '@iconify/icons-ri/image-edit-fill'
import image2Fill from '@iconify/icons-ri/image-2-fill'
import aspectRatioLine from '@iconify/icons-ri/aspect-ratio-line'
import restartFill from '@iconify/icons-ri/restart-fill'

/* https://github.com/DominicTobias/react-image-crop */

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import { useDebounceEffect } from '../../Hooks/Helpers/useDebouncedEffect'
import {
  Controls,
  ImageEditorMain,
  ImageEditorToolbar,
  ImageEditorWrapper,
  ImagePreview,
  PreviewTitle,
  RangeControlWrapper,
  RangeValue,
  ToggleAndSubmit
} from './Screenshot.style'

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const rotateRads = rotate * TO_RADIANS
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY)
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY)
  // 3) Rotate around the origin
  ctx.rotate(rotateRads)
  // 2) Scale the image
  ctx.scale(scale, scale)
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)

  ctx.restore()
}

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

interface ImageEditorProps {
  // If not provided adds the file image input in toolbar
  src?: string
  openAsEditing?: boolean
  onSubmit: (blob: Blob) => void
}

const ImageEditor = ({ src, onSubmit, openAsEditing }: ImageEditorProps) => {
  const [imgSrc, setImgSrc] = useState(src ?? '')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(openAsEditing)

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  const onEditSubmit = () => {
    // Get blob from imageRef
    if (imgRef.current && previewCanvasRef.current && completedCrop) {
      previewCanvasRef.current.toBlob((blob) => {
        if (blob) {
          onSubmit(blob)
        }
      })
    }
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  const handleToggleAspectClick = () => {
    if (aspect) {
      setAspect(undefined)
    } else if (imgRef.current) {
      const { width, height } = imgRef.current
      setAspect(16 / 9)
      setCrop(centerAspectCrop(width, height, 16 / 9))
    }
  }

  return (
    <ImageEditorWrapper>
      <ImageEditorToolbar>
        <Controls>
          {isEditing ? (
            <>
              <PreviewTitle>Edit</PreviewTitle>
              {!src && <input type="file" accept="image/*" onChange={onSelectFile} />}
              <RangeControlWrapper>
                <label htmlFor="scale-input">
                  Scale <RangeValue>x{scale}</RangeValue>
                </label>
                <input
                  id="scale-input"
                  type="range"
                  step="0.1"
                  min="0.1"
                  max="3"
                  value={scale}
                  disabled={!imgSrc}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
                <IconButton title="Reset" icon={restartFill} onClick={() => setScale(1)} />
              </RangeControlWrapper>
              <RangeControlWrapper>
                <label htmlFor="rotate-input">
                  Rotate <RangeValue>{rotate}&#176;</RangeValue>
                </label>
                <input
                  id="rotate-input"
                  type="range"
                  min="-180"
                  max="180"
                  value={rotate}
                  disabled={!imgSrc}
                  onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
                />
                <IconButton title="Reset" icon={restartFill} onClick={() => setRotate(0)} />
              </RangeControlWrapper>
              <IconButton
                onClick={handleToggleAspectClick}
                title={aspect === undefined ? "Image's Aspect Ratio" : 'Free Aspect Ratio'}
                icon={aspectRatioLine}
                highlight={aspect !== undefined}
              />
            </>
          ) : (
            <>
              <PreviewTitle>Preview</PreviewTitle>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </>
          )}
        </Controls>
        <ToggleAndSubmit>
          <Button onClick={onEditSubmit} disabled={!imgSrc}>
            Save
          </Button>

          <IconButton
            title={isEditing ? 'Preview' : 'Edit'}
            icon={isEditing ? image2Fill : imageEditFill}
            onClick={() => setIsEditing((e) => !e)}
          />
        </ToggleAndSubmit>
      </ImageEditorToolbar>
      <ImageEditorMain isEditing={isEditing}>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
      </ImageEditorMain>
      <ImagePreview isEditing={isEditing}>
        {!!completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: '1px solid black',
              objectFit: 'contain',
              width: completedCrop.width,
              height: completedCrop.height
            }}
          />
        )}
      </ImagePreview>
    </ImageEditorWrapper>
  )
}

export const Screenshot = () => {
  return (
    <div>
      <ImageEditor
        onSubmit={(blob) => {
          console.log('Cropped image blob here', { blob })
        }}
      />
    </div>
  )
}
