import { useState } from 'react'

function useScoreBoard() {
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)

  const updatePlayer1Score = () => {
    setPlayer1Score((prevScore) => prevScore + 1)
  }

  const updatePlayer2Score = () => {
    setPlayer2Score((prevScore) => prevScore + 1)
  }

  return {
    player1Score,
    player2Score,
    updatePlayer1Score,
    updatePlayer2Score
  }
}

export default useScoreBoard
