import { useState, useEffect, useRef } from 'react'
import { uniqueRandom } from '../../Utils/unique-random'
import {
  ActionBoard,
  ActionButton,
  Container,
  PlayArea,
  Scoreboard,
  GameOverContainer
} from '../../Style/OnboardingGame'
import Timer from './Timer'
import KeyboardSprite from './KeyboardSprite'
import MouseSprite from './MouseSprite'
import GameInstructions from './GameInstructions'
import Modal from 'react-modal'
import GameProgressBar from './GameProgressBar'
function MainGameScreen() {
  const [start, setStart] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)

  const [timer, setTimer] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [keyTime, setKeyTime] = useState<number>(0)
  const [clickTime, setClickTime] = useState<number>(0)

  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)

  const [spriteDec, setSpriteDec] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>()

  const [randomKey, setRandomKey] = useState<string>('')
  const [height, setHeight] = useState<number>(0)
  const [width, setWidth] = useState<number>(0)

  const SCREEN_HEIGHT = window.innerHeight
  const SCREEN_WIDTH = window.innerWidth

  const MIN_HEIGHT = SCREEN_HEIGHT / 2 - height / 2 + 100
  const MAX_HEIGHT = SCREEN_HEIGHT / 2 + height / 2 - 100

  const MIN_WIDTH = SCREEN_WIDTH / 2 - width / 2 + 100
  const MAX_WIDTH = SCREEN_WIDTH / 2 + width / 2 - 100

  const x_random_coord = uniqueRandom(MIN_WIDTH, MAX_WIDTH)
  const y_random_coord = uniqueRandom(MIN_HEIGHT, MAX_HEIGHT)

  const random_sprite = uniqueRandom(1, 100)

  const generateRandomCoord = () => {
    setY(y_random_coord())
    setX(x_random_coord())
  }

  const generateRandomSprite = () => {
    setSpriteDec(random_sprite())
    console.log(random_sprite())
  }

  const getNewSize = () => {
    if (typeof containerRef.current !== 'undefined') {
      setWidth(containerRef.current.clientWidth)
      setHeight(containerRef.current.clientHeight)
    }
  }

  const clickHandler = () => {
    setClickTime((time) => time + currentTime)
    setCurrentTime(0)
    generateRandomCoord()
    generateRandomSprite()
  }

  const modalHandler = () => {
    setGameOver(false)
  }

  const keyPressHandler = (e: any) => {
    if (e.key === randomKey) {
      setKeyTime((time) => time + currentTime)
      setCurrentTime(0)
      generateRandomCoord()
      generateRandomSprite()

      generateRandomLetter()
    }
  }

  const StartActionHandler = () => {
    setStart(true)
    setTimer(true)
  }
  const StopActionHandler = () => {
    setStart(false)
    setTimer(false)
    setGameOver(true)
  }

  const generateRandomLetter = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz,.;']["
    setRandomKey(alphabet[Math.floor(Math.random() * alphabet.length)])
  }

  useEffect(() => {
    generateRandomCoord()
    generateRandomSprite()

    generateRandomLetter()
    getNewSize()
  }, [])

  const play =
    spriteDec % 2 ? (
      <KeyboardSprite x={x} y={y} letter={randomKey} />
    ) : (
      <MouseSprite x={x} y={y} clickHandler={clickHandler} />
    )

  return (
    <Container tabIndex={-1} onKeyDown={keyPressHandler}>
      {gameOver ? (
        <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={modalHandler} isOpen={gameOver}>
          <GameOverContainer>
            <h1>Game Over!</h1>
            <h3>Key Time: {keyTime}</h3>
            <h3>Click Time: {clickTime}</h3>
            <GameProgressBar percentage={(clickTime * 100) / (clickTime + keyTime)} />
          </GameOverContainer>
        </Modal>
      ) : (
        ''
      )}
      <Scoreboard>{start ? <Timer active={timer} time={currentTime} setTime={setCurrentTime} /> : ''}</Scoreboard>
      <ActionBoard>
        {start ? (
          <ActionButton action={'stop'} onClick={StopActionHandler}>
            STOP
          </ActionButton>
        ) : (
          <ActionButton action={'start'} onClick={StartActionHandler}>
            START
          </ActionButton>
        )}
      </ActionBoard>
      <PlayArea ref={containerRef}>{start ? play : <GameInstructions />}</PlayArea>
    </Container>
  )
}

export default MainGameScreen
