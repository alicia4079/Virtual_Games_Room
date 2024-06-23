import React, { useReducer, useState, useEffect } from 'react'
import './boardShip.css'
import Ship from '../../components/ship/ship'
import Form from '../../components/form/form'
import useScoreBoard from '../../customHooks/useScoreBoard'
import { generateRandomPositions, handleAddPlayerNames, handleAddShip, handleResetGame, handleShoot, handleShowAlert, handleShowHitAlert, handleSwitchTurn } from '../../utils/battleshipUtils'

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
    alertShown: false,
    hitAlertShown: false
  };

  const gameReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_SHIP':
        return handleAddShip(state, action);
      case 'SHOOT':
        return handleShoot(state, action);
      case 'SWITCH_TURN':
        return handleSwitchTurn(state);
      case 'ADD_PLAYER_NAMES':
        return handleAddPlayerNames(state, action);
      case 'SHOW_ALERT':
        return handleShowAlert(state);
      case 'SHOW_HIT_ALERT':
        return handleShowHitAlert(state, action);
      case 'RESET_GAME':
        return handleResetGame(state, initialState);
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [playerNames, setPlayerNames] = useState({ playerX: '', playerO: '' });
  const [showModal, setShowModal] = useState(true);
  const { player1Score, player2Score, updatePlayer1Score, updatePlayer2Score } =
    useScoreBoard();

  const placeShip = (player, ship) => {
    dispatch({ type: 'ADD_SHIP', payload: { player, ship } });
  };

  const shoot = (shooter, targetX, targetY) => {
    dispatch({
      type: 'SHOOT',
      payload: { shooter, targetX, targetY }
    });
    dispatch({ type: 'SWITCH_TURN' });
  };

  const handleFormSubmit = (data) => {
    setPlayerNames({ playerX: data.playerX, playerO: data.playerO });
    dispatch({
      type: 'ADD_PLAYER_NAMES',
      payload: { playerX: data.playerX, playerO: data.playerO }
    });
    dispatch({ type: 'SWITCH_TURN' });
    setShowModal(false);
  };

  useEffect(() => {
    const predefinedShips = [{ size: 2 }, { size: 3 }, { size: 4 }, { size: 5 }];

    const randomPositionsPlayer1 = generateRandomPositions(predefinedShips);
    const randomPositionsPlayer2 = generateRandomPositions(predefinedShips);

    randomPositionsPlayer1.forEach((ship) => {
      placeShip('player1', ship);
    });
    randomPositionsPlayer2.forEach((ship) => {
      placeShip('player2', ship);
    });
  }, []);

  useEffect(() => {
    if (state.hitAlertShown) {
      const currentPlayerName = state.player1.isTurn
        ? playerNames.playerO
        : playerNames.playerX;
      alert(`${currentPlayerName} has hit!`);
      dispatch({ type: 'SHOW_HIT_ALERT', payload: false });
    }
  }, [state.hitAlertShown, state.player1.isTurn, playerNames]);

  useEffect(() => {
    if (state.gameOver && !state.alertShown) {
      if (state.winner === playerNames.playerX) {
        alert(`¡${playerNames.playerX} wins!🏆`);
        updatePlayer1Score();
      } else if (state.winner === playerNames.playerO) {
        alert(`¡${playerNames.playerO} wins!🏆`);
        updatePlayer2Score();
      }
      dispatch({ type: 'SHOW_ALERT' });

      setTimeout(() => {
        dispatch({ type: 'RESET_GAME' });
        setShowModal(false);
      }, 3000);
    }
  }, [
    state.gameOver,
    state.winner,
    playerNames,
    updatePlayer1Score,
    updatePlayer2Score,
    state.alertShown
  ]);

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
            const player = state.player1.isTurn ? 'player1' : 'player2';
            const isShot = state[player].shots.some(
              (shot) => shot.x === rowIndex && shot.y === colIndex
            );
            const isHit =
              isShot &&
              state[player].shots.find(
                (shot) => shot.x === rowIndex && shot.y === colIndex
              ).hit;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square-ship${isShot ? ' shot' : ''}${
                  isHit ? ' hit' : ''
                }`}
                onClick={() => {
                  if (!isShot) {
                    dispatch({
                      type: 'SQUARE_CLICKED'
                    });
                    shoot(player, rowIndex, colIndex);
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
            );
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
  );
};

export default BoardShip;