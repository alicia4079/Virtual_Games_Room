import React, { useState } from 'react'
import Row from '../row/row'
import './board.css'
import useScoreBoard from '../../customHooks/useScoreBoard'
import useGameLogic from '../../utils/useGameLogic'
import getWinner from '../../utils/getWinner'
import resetGame from '../../utils/resetGame'
import handleClick from '../../utils/handleClick'


function Board({ playerX, playerO }) {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const { player1Score, player2Score, updatePlayer1Score, updatePlayer2Score } =
    useScoreBoard()

  const resetGameHandler = () => resetGame(setSquares, setXIsNext)
  
  useGameLogic(squares, playerX, playerO, updatePlayer1Score, updatePlayer2Score, resetGameHandler)

  const status = getWinner(squares, playerX, playerO, xIsNext)

  return (
    <div>
      <div className='status'>{status}</div>
      <div className='scoreboard'>
        <div className='player-score'>
          {playerX} {player1Score}
        </div>
        <div className='player-score'>
          {playerO} {player2Score}
        </div>
      </div>
      {[0, 1, 2].map((rowIndex) => ( 
        <Row
          key={rowIndex}
          squares={squares.slice(rowIndex * 3, (rowIndex + 1) * 3)}
          onClick={(i) => handleClick(rowIndex * 3 + i, squares, setSquares, xIsNext, setXIsNext)}
        />
      ))}
    </div>
  )
}

export default Board
