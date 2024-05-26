import React, { useReducer, useState, useEffect } from 'react'
import './boardShip.css'
import Ship from '../../components/ship/ship'
import Form from '../../components/form/form'
import useScoreBoard from '../../customHooks/useScoreBoard'

const BoardShip = () => {
  const initialState = {
    player1: {
      name: '',
      ships: [],
      shots: [],
      isTurn: true,
      squaresClicked: 0
    },
    player2: {
      name: '',
      ships: [],
      shots: [],
      isTurn: false,
      squaresClicked: 0
    },
    gameOver: false,
    winner: null,
    alertShown: false
  }

  const actionTypes = {
    ADD_SHIP: 'ADD_SHIP',
    SHOOT: 'SHOOT',
    GAME_OVER: 'GAME_OVER',
    SWITCH_TURN: 'SWITCH_TURN',
    SQUARE_CLICKED: 'SQUARE_CLICKED',
    ADD_PLAYER_NAMES: 'ADD_PLAYER_NAMES',
    SHOW_ALERT: 'SHOW_ALERT',
    RESET_GAME: 'RESET_GAME'
  }

  const gameReducer = (state, action) => {
    switch (action.type) {
      case actionTypes.ADD_SHIP:
        const { player, ship } = action.payload
        if (!ship) return state

        return {
          ...state,
          [player]: {
            ...state[player],
            ships: [...state[player].ships, ship],
            squaresClicked: 0
          }
        }
      case actionTypes.SHOOT:
        const { shooter, targetX, targetY } = action.payload
        const opponent = shooter === 'player1' ? 'player2' : 'player1'
        const hit = state[opponent]?.ships?.some((ship) =>
          ship.positions.some((pos) => pos.x === targetX && pos.y === targetY)
        )

        const newShots = [
          ...(state[shooter]?.shots || []),
          { x: targetX, y: targetY, hit }
        ]
        let gameOver = state.gameOver
        let winner = state.winner
        let opponentSquaresClicked = state[opponent].squaresClicked

        if (hit) {
          opponentSquaresClicked++
          const totalHitsRequired = state[opponent].ships.reduce(
            (acc, ship) => acc + ship.size,
            0
          )

          if (opponentSquaresClicked === totalHitsRequired) {
            gameOver = true
            winner = state[shooter].name
          }
        }

        return {
          ...state,
          [shooter]: { ...state[shooter], shots: newShots },
          [opponent]: {
            ...state[opponent],
            squaresClicked: opponentSquaresClicked
          },
          gameOver,
          winner
        }
      case actionTypes.SWITCH_TURN:
        return {
          ...state,
          player1: { ...state.player1, isTurn: !state.player1.isTurn },
          player2: { ...state.player2, isTurn: !state.player2.isTurn }
        }
      case actionTypes.ADD_PLAYER_NAMES:
        return {
          ...state,
          player1: { ...state.player1, name: action.payload.playerX },
          player2: { ...state.player2, name: action.payload.playerO }
        }
      case actionTypes.SHOW_ALERT:
        return {
          ...state,
          alertShown: true
        }
      case actionTypes.RESET_GAME:
        return {
          ...initialState,
          player1: {
            ...initialState.player1,
            name: state.player1.name
          },
          player2: {
            ...initialState.player2,
            name: state.player2.name
          }
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [playerNames, setPlayerNames] = useState({ playerX: '', playerO: '' })
  const [showModal, setShowModal] = useState(true)
  const { player1Score, player2Score, updatePlayer1Score, updatePlayer2Score } =
    useScoreBoard()

  const placeShip = (player, ship) => {
    dispatch({ type: actionTypes.ADD_SHIP, payload: { player, ship } })
  }

  const shoot = (shooter, targetX, targetY) => {
    dispatch({
      type: actionTypes.SHOOT,
      payload: { shooter, targetX, targetY }
    })
    dispatch({ type: actionTypes.SWITCH_TURN })
  }

  const handleFormSubmit = (data) => {
    setPlayerNames({ playerX: data.playerX, playerO: data.playerO })
    dispatch({
      type: actionTypes.ADD_PLAYER_NAMES,
      payload: { playerX: data.playerX, playerO: data.playerO }
    })
    dispatch({ type: actionTypes.SWITCH_TURN })
    setShowModal(false)
  }

  useEffect(() => {
    const predefinedShips = [{ size: 2 }, { size: 3 }, { size: 4 }, { size: 5 }]

    const randomPositionsPlayer1 = generateRandomPositions(predefinedShips)
    const randomPositionsPlayer2 = generateRandomPositions(predefinedShips)

    randomPositionsPlayer1.forEach((ship) => {
      placeShip('player1', ship)
    })
    randomPositionsPlayer2.forEach((ship) => {
      placeShip('player2', ship)
    })
  }, [])

  useEffect(() => {
    if (state.gameOver && !state.alertShown) {
      if (state.winner === playerNames.playerX) {
        alert(`¡${playerNames.playerX} wins!`)
        updatePlayer1Score()
      } else if (state.winner === playerNames.playerO) {
        alert(`¡${playerNames.playerO} wins!`)
        updatePlayer2Score()
      }
      dispatch({ type: actionTypes.SHOW_ALERT })

      setTimeout(() => {
        dispatch({ type: actionTypes.RESET_GAME })
        setShowModal(false)
      }, 3000)
    }
  }, [
    state.gameOver,
    state.winner,
    playerNames,
    updatePlayer1Score,
    updatePlayer2Score,
    state.alertShown
  ])

  const generateRandomPositions = (ships) => {
    const directions = ['horizontal', 'vertical']
    const getRandomInt = (max) => Math.floor(Math.random() * max)

    const isValidPosition = (ship, existingShips) => {
      for (const existingShip of existingShips) {
        for (const pos of ship.positions) {
          for (const existingPos of existingShip.positions) {
            if (
              Math.abs(pos.x - existingPos.x) <= 1 &&
              Math.abs(pos.y - existingPos.y) <= 1
            ) {
              return false
            }
          }
        }
      }
      return true
    }

    const getRandomShip = (ship) => {
      const direction = directions[getRandomInt(directions.length)]
      const positions = []

      let x, y
      if (direction === 'horizontal') {
        x = getRandomInt(8 - ship.size)
        y = getRandomInt(8)
      } else {
        x = getRandomInt(8)
        y = getRandomInt(8 - ship.size)
      }

      for (let i = 0; i < ship.size; i++) {
        positions.push(
          direction === 'horizontal' ? { x: x + i, y } : { x, y: y + i }
        )
      }

      return { ...ship, orientation: direction, positions }
    }

    const positionedShips = []

    ships.forEach((ship) => {
      let newShip
      do {
        newShip = getRandomShip(ship)
      } while (!isValidPosition(newShip, positionedShips))
      positionedShips.push(newShip)
    })

    return positionedShips
  }

  return (
    <div className='boardShip'>
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

      <div className='turn'>
        <p>
          Player 1:{' '}
          <span className={state.player1.isTurn ? 'current-turn' : ''}>
            {playerNames.playerX}
          </span>
        </p>
        <p>
          Player 2:{' '}
          <span className={state.player2.isTurn ? 'current-turn' : ''}>
            {playerNames.playerO}
          </span>
        </p>
        <div className='scoreboard'>
          <div className='player-score'>
            {playerNames.playerX} {player1Score}
          </div>
          <div className='player-score'>
            {playerNames.playerO} {player2Score}
          </div>
        </div>
      </div>

      <div className='grid'>
        {Array.from({ length: 8 }).map((_, rowIndex) =>
          Array.from({ length: 8 }).map((_, colIndex) => {
            const player = state.player1.isTurn ? 'player1' : 'player2'
            const isShot = state[player].shots.some(
              (shot) => shot.x === rowIndex && shot.y === colIndex
            )
            const isHit =
              isShot &&
              state[player].shots.find(
                (shot) => shot.x === rowIndex && shot.y === colIndex
              ).hit

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square-ship${isShot ? ' shot' : ''}${
                  isHit ? ' hit' : ''
                }`}
                onClick={() => {
                  if (!isShot) {
                    dispatch({
                      type: actionTypes.SQUARE_CLICKED
                    })
                    shoot(player, rowIndex, colIndex)
                  }
                }}
              >
                {state[player].ships.map((ship, index) => (
                  <Ship
                    key={index}
                    size={ship.size}
                    orientation={ship.orientation}
                    position={ship.positions[0]}
                  />
                ))}
              </div>
            )
          })
        )}
      </div>

      {state.gameOver && (
        <div className='game-over'>
          <h2>Game over!</h2>
          <p>{state.winner} wins!</p>
        </div>
      )}
    </div>
  )
}

export default BoardShip
