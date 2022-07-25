import Modal from 'react-modal'
import { useGameStore } from '../../Stores/useGameStore'
import MainGameScreen from './MainGameScreen'
const GameModal = () => {
  const open = useGameStore((store) => store.open)
  const closeModal = useGameStore((store) => store.closeModal)
  return (
    <Modal className="ModalContent" isOpen={open} overlayClassName="ModalOverlay" onRequestClose={closeModal}>
      <MainGameScreen />
    </Modal>
  )
}

export default GameModal
