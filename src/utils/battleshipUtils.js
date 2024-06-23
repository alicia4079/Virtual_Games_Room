export const handleAddShip = (state, action) => {
  const { player, ship } = action.payload;
  if (!ship) return state;

  return {
    ...state,
    [player]: {
      ...state[player],
      ships: [...state[player].ships, ship],
      squaresClicked: 0
    }
  };
};

export const handleShoot = (state, action) => {
  const { shooter, targetX, targetY } = action.payload;
  const opponent = shooter === 'player1' ? 'player2' : 'player1';
  const hit = state[opponent]?.ships?.some((ship) =>
    ship.positions.some((pos) => pos.x === targetX && pos.y === targetY)
  );

  const newShots = [
    ...(state[shooter]?.shots || []),
    { x: targetX, y: targetY, hit }
  ];
  let gameOver = state.gameOver;
  let winner = state.winner;
  let opponentSquaresClicked = state[opponent].squaresClicked;

  if (hit) {
    opponentSquaresClicked++;
    const totalHitsRequired = state[opponent].ships.reduce(
      (acc, ship) => acc + ship.size,
      0
    );

    if (opponentSquaresClicked === totalHitsRequired) {
      gameOver = true;
      winner = state[shooter].name;
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
    winner,
    hitAlertShown: hit
  };
};

export const handleSwitchTurn = (state) => ({
  ...state,
  player1: { ...state.player1, isTurn: !state.player1.isTurn },
  player2: { ...state.player2, isTurn: !state.player2.isTurn }
});

export const handleAddPlayerNames = (state, action) => ({
  ...state,
  player1: { ...state.player1, name: action.payload.playerX },
  player2: { ...state.player2, name: action.payload.playerO }
});

export const handleShowAlert = (state) => ({
  ...state,
  alertShown: true
});

export const handleShowHitAlert = (state, action) => ({
  ...state,
  hitAlertShown: action.payload
});

export const handleResetGame = (state, initialState) => ({
  ...initialState,
  player1: {
    ...initialState.player1,
    name: state.player1.name
  },
  player2: {
    ...initialState.player2,
    name: state.player2.name
  }
});

export const generateRandomPositions = (ships) => {
  const directions = ['horizontal', 'vertical'];
  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const isValidPosition = (ship, existingShips) => {
    for (const existingShip of existingShips) {
      for (const pos of ship.positions) {
        for (const existingPos of existingShip.positions) {
          if (
            Math.abs(pos.x - existingPos.x) <= 1 &&
            Math.abs(pos.y - existingPos.y) <= 1
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const getRandomShip = (ship) => {
    const direction = directions[getRandomInt(directions.length)];
    const positions = [];

    let x, y;
    if (direction === 'horizontal') {
      x = getRandomInt(8 - ship.size);
      y = getRandomInt(8);
    } else {
      x = getRandomInt(8);
      y = getRandomInt(8 - ship.size);
    }

    for (let i = 0; i < ship.size; i++) {
      positions.push(
        direction === 'horizontal' ? { x: x + i, y } : { x, y: y + i }
      );
    }

    return { ...ship, orientation: direction, positions };
  };

  const positionedShips = [];

  ships.forEach((ship) => {
    let newShip;
    do {
      newShip = getRandomShip(ship);
    } while (!isValidPosition(newShip, positionedShips));
    positionedShips.push(newShip);
  });

  return positionedShips;
};