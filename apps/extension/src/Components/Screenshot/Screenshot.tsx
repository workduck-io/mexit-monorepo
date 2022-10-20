import { IconButton, useDebounceEffect } from '@mexit/shared'
import { Button } from '@workduck-io/mex-components'
import React, { useRef, useState } from 'react'
import imageEditFill from '@iconify/icons-ri/image-edit-fill'
import { useAuthStore } from '../../Hooks/useAuth'
import image2Fill from '@iconify/icons-ri/image-2-fill'
import aspectRatioLine from '@iconify/icons-ri/aspect-ratio-line'
import restartLine from '@iconify/icons-ri/restart-line'

/* https://github.com/DominicTobias/react-image-crop */

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
// import { useDebounceEffect } from '../../Hooks/Helpers/useDebouncedEffect'
import {
  Controls,
  ImageContent,
  ImageEditorMain,
  ImageEditorToolbar,
  ImageEditorWrapper,
  ImagePreview,
  RangeControlWrapper,
  RangeValue,
  SpotlightScreenshotWrapper,
  ToggleAndSubmit,
  ViewToggle
} from './Screenshot.style'
import { apiURLs, mog } from '@mexit/core'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { client } from '@workduck-io/dwindle'
import { Icon } from '@iconify/react'
import NoteSelector from '../Floating/NoteSelector'

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext('2d')
  // mog('ctx', { image, canvas, crop, scale, rotate })

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

  canvas.width = Math.floor((crop.width === 0 ? image.width : crop.width) * scaleX * pixelRatio)
  canvas.height = Math.floor((crop.height === 0 ? image.height : crop.height) * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.width !== 0 ? crop.x * scaleX : 0
  const cropY = crop.height !== 0 ? crop.y * scaleY : 0

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
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
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
      if (imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        // mog('imgRef.current', { completedCrop })
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
      if (crop.width !== 0 && crop.height !== 0) {
        const cropAspect = crop.width / crop.height
        setAspect(cropAspect)
      } else {
        const { width, height } = imgRef.current
        setAspect(width / height)
        setCrop(centerAspectCrop(width, height, width / height))
      }
    }
  }

  // mog('ImageEditor', { imgSrc, crop, completedCrop, scale, rotate, aspect })

  return (
    <ImageEditorWrapper>
      <ImageEditorToolbar>
        <Controls>
          <ViewToggle>
            <Button primary={isEditing} transparent={!isEditing} onClick={() => setIsEditing(true)}>
              <Icon icon="ri:crop-line" />
              Crop
            </Button>
            <Button primary={!isEditing} transparent={isEditing} onClick={() => setIsEditing(false)}>
              <Icon icon="ri:image-line" />
              Preview
            </Button>
          </ViewToggle>
          <>
            {!src && <input type="file" accept="image/*" onChange={onSelectFile} />}
            <RangeControlWrapper>
              <label htmlFor="scale-input" onDoubleClick={() => setScale(1)}>
                <Icon icon="ri:zoom-in-line" />
                <RangeValue>x{scale}</RangeValue>
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
            </RangeControlWrapper>
            <RangeControlWrapper>
              <label htmlFor="rotate-input" onDoubleClick={() => setRotate(0)}>
                <Icon icon="bx:rotate-right" />
                <RangeValue>{rotate}&#176;</RangeValue>
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
            </RangeControlWrapper>
            <IconButton
              onClick={handleToggleAspectClick}
              title={aspect === undefined ? "Image's Aspect Ratio" : 'Free Aspect Ratio'}
              icon={aspectRatioLine}
              highlight={aspect !== undefined}
            />
          </>
        </Controls>
        <ToggleAndSubmit>
          <Button onClick={onEditSubmit} disabled={!imgSrc}>
            Save
          </Button>
        </ToggleAndSubmit>
      </ImageEditorToolbar>
      <ImageContent>
        <ImageEditorMain isEditing={isEditing}>
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_crop, percentCrop) => {
                // mog('onChange', { crop, percentCrop })
                setCrop(percentCrop)
              }}
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
                objectFit: 'contain',
                width: completedCrop.width === 0 ? imgRef?.current?.width : completedCrop.width,
                height: completedCrop.height === 0 ? imgRef?.current?.height : completedCrop.height
              }}
            />
          )}
        </ImagePreview>
      </ImageContent>
    </ImageEditorWrapper>
  )
}

function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    } catch {
      reject()
    }
  })
}

export const Screenshot = () => {
  const screenshot = useSputlitStore((s) => s.screenshot)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const [isSaving, setIsSaving] = useState(false)
  const floatingPortalRef = useRef<HTMLDivElement>(null)

  // mog('screenshot', { screenshot })

  const onSubmit = async (blob: Blob) => {
    const base64base = await blobToBase64(blob)
    // Remove base64 header
    const base64 = base64base?.toString().replace('data:image/png;base64,', '')

    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'UPLOAD_IMAGE',
        data: {
          workspaceId: workspaceDetails.id,
          base64
        }
      },
      (response) => {
        const { message, error } = response
        if (error) {
          console.error(error)
          return
        }
        console.log(message)
      }
    )
  }

  return (
    <SpotlightScreenshotWrapper>
      <ImageEditor
        src={screenshot}
        openAsEditing
        onSubmit={(blob) => {
          console.log('Cropped image blob here', { blob })
          onSubmit(blob)
          setIsSaving(true)
        }}
      />
      {isSaving && (
        <NoteSelector
          selectionMessage="Select a note to save the screenshot to"
          root={floatingPortalRef.current}
          onSelect={(nodeid) => {
            mog('onSelect', { nodeid })
          }}
        />
      )}
      <div style={{ zIndex: 20 }} id="screenshot-note-select-modal" ref={floatingPortalRef} />
    </SpotlightScreenshotWrapper>
  )
}
