import calculateWinner from "./calculateWinner"

const handleClick = (i, squares, setSquares, xIsNext, setXIsNext) => {
  const newSquares = squares.slice()
  if (calculateWinner(newSquares) || newSquares[i]) {
    return
  }
  newSquares[i] = xIsNext ? 'X' : 'O'
  setSquares(newSquares)
  setXIsNext(!xIsNext)
}

export default handleClick