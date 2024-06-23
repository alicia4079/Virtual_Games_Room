import calculateWinner from "./calculateWinner"

const getWinner = (squares, playerX, playerO, xIsNext) => {
  const winner = calculateWinner(squares)
  if (winner) {
    return `Winner: ${winner === 'X' ? playerX : playerO}`
  } else {
    return `Next player: ${xIsNext ? playerX : playerO}`
  }
}

export default getWinner