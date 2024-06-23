function isBoardFull(squares) {
  return squares.every((square) => square !== null)
}

export default isBoardFull