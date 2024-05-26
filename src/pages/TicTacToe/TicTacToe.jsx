import React, { useState } from 'react'
import Board from '../../components/board/board'
import './TicTacToe.css'
import Form from '../../components/form/form'

const TicTacToe = () => {
  const [showModal, setShowModal] = useState(true)
  const [playerX, setPlayerX] = useState('')
  const [playerO, setPlayerO] = useState('')

  const handleFormSubmit = (data) => {
    setPlayerX(data.playerX)
    setPlayerO(data.playerO)
    setShowModal(false)
  }

  return (
    <div className='gameTic'>
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Enter Player Names</h2>
            <Form onSubmit={handleFormSubmit} />
          </div>
        </div>
      )}
      <Board playerX={playerX} playerO={playerO} />
    </div>
  )
}

export default TicTacToe
