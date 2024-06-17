import React, { useEffect, useState } from 'react'
import Row from '../row/row'
import './board.css'
import useScoreBoard from '../../customHooks/useScoreBoard'

function Board({ playerX, playerO }) {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const { player1Score, player2Score, updatePlayer1Score, updatePlayer2Score } =
    useScoreBoard()

  const handleClick = (i) => {
    const newSquares = squares.slice()
    if (calculateWinner(newSquares) || newSquares[i]) {
      return
    }
    newSquares[i] = xIsNext ? 'X' : 'O'
    setSquares(newSquares)
    setXIsNext(!xIsNext)
  }

  useEffect(() => {
    const winner = calculateWinner(squares)
    if (winner) {
      const winnerName = winner === 'X' ? playerX : playerO
      setTimeout(() => {
        alert(`Congratulations ${winnerName}, you are the winner!🏆`)
        if (winner === 'X') {
          updatePlayer1Score()
        } else {
          updatePlayer2Score()
        }
        resetGame()
      }, 1000) 
    } else if (isBoardFull(squares)) {
      setTimeout(() => {
        alert("It's a draw!")
        resetGame()
      }, 1000) 
    }
  }, [squares])


  const resetGame = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null)
  }

  const renderRow = (rowIndex) => {
    return (
      <Row
        key={rowIndex}
        squares={squares.slice(rowIndex * 3, (rowIndex + 1) * 3)}
        onClick={(i) => handleClick(rowIndex * 3 + i)}
      />
    )
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = `Winner: ${winner === 'X' ? playerX : playerO}`
  } else {
    status = `Next player: ${xIsNext ? playerX : playerO}`
  }

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
      {[0, 1, 2].map((rowIndex) => renderRow(rowIndex))}
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default Board
