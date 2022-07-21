import male_1 from '../Assets/images/Male.png'
import male_2 from '../Assets/images/Male_1.png'
import female_1 from '../Assets/images/Female.png'
import female_2 from '../Assets/images/Female_1.png'

import { ImageContainer, ImageWrapper, Image } from '../Style/AuthFlow'

const ImagesContainer = () => {
  const images = [
    {
      tag: 'image_1_male',
      img: male_1
    },
    {
      tag: 'image_2_male',
      img: male_2
    },
    {
      tag: 'image_3_male',
      img: female_1
    },
    {
      tag: 'image_4_male',
      img: female_2
    }
  ]

  return (
    <ImageContainer>
      {images.map((image) => {
        return (
          <ImageWrapper>
            <Image src={image.img} alt={image.tag} />
          </ImageWrapper>
        )
      })}
    </ImageContainer>
  )
}

export default ImagesContainer
