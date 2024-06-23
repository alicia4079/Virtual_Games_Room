const resetGame = (setSquares, setXIsNext) => {
  setSquares(Array(9).fill(null))
  setXIsNext(true)
}

export default resetGame