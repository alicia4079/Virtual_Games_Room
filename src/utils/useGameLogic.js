import { useEffect } from "react"
import isBoardFull from "./isBoardFull"
import calculateWinner from "./calculateWinner"

const useGameLogic = (squares, playerX, playerO, updatePlayer1Score, updatePlayer2Score, resetGame) => {
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
}

export default useGameLogic