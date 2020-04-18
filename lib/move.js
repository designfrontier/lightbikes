const axios = require('axios');
const { getBoardSize } = require('../lib/board');
const { getOpponent } = require('../lib/players');

const getDistance = (m,e) => {
  return Math.sqrt(Math.pow(m.x - e.x, 2) + Math.pow(m.y - e.y, 2))
};


const newCoords = (me, board, players, prevDistance) => {
  const enemy = getOpponent(me, players);
  const res = {x: me.x, y: me.y};
  const getRandom = () =>  Math.floor(Math.random() * Math.floor(5));
  const inEdge = c => c.x === 39 || c.x === 0 || c.y === 39 || c.y === 0;
  const getFuture = (coords) => {
    const validMoves = Object
      .keys(moves)
      .map(k => moves[k](coords))
      .filter(c => validMove(board, c));

    const fartherFuture = validMoves.reduce((a,m) => {
      return a + Object
      .keys(moves)
      .map(k => moves[k](m))
      .filter(c => validMove(board, c))
      .length;
    }, 0);

    return validMoves.length + fartherFuture;
  };

  const validMoves = Object
    .keys(moves)
    .map(k => moves[k](res))
    .filter(c => validMove(board, c));

  const bestMove = validMoves.reduce((a, b) => {
    const da = getDistance(a, enemy);
    const db = getDistance(b, enemy);

    if (da >= db) {
      return b;
    }

    return a;
  });

  const safestMove = validMoves.reduce((a, b) => {
    const fa = getFuture(a);
    const fb = getFuture(b);

    if (fa >= fb) {
      return b;
    }

    return a;
  });

  console.log('future:', bestMove, safestMove);
  return getFuture(bestMove) >= getFuture(safestMove) ? bestMove : safestMove;

  // return getDistance(bestMove, enemy) > prevDistance ? worst : bestMove;
};

const validMove = (board, coords) => {
  const boardMeta = getBoardSize(board);

  if (boardMeta < coords.y || boardMeta < coords.x || coords.x < 0 || coords.y < 0) {
    return false;
  }

  return board[coords.x][coords.y] === null;
}

const moves = {
  up: coords => {
    return { y: parseInt(coords.y, 10) - 1, x: parseInt(coords.x, 10) }
  },
  down: coords => ({ y: parseInt(coords.y, 10) + 1, x: parseInt(coords.x, 10) }),
  right: coords => ({ y: parseInt(coords.y, 10), x: parseInt(coords.x, 10) + 1 }),
  left: coords => ({ y: parseInt(coords.y, 10), x: parseInt(coords.x, 10) - 1 }),
};

const move = (gameId, me, board, players, prevDistance) => {
  const { x, y } = newCoords(me, board, players, prevDistance);
  const enemy = getOpponent(me, players);
  const boardMeta = getBoardSize(board);
  console.log('***********************************************');
  console.log(`game id: ${gameId}`);
  console.log(`my id: ${me.id}`);
  console.log(`prev distance to enemy: ${prevDistance}`);
  console.log(`moving from: x:${me.x} y:${me.y}`);
  console.log(`moving to: x:${x} y:${y}`);
  console.log(`board meta: ${boardMeta}`)
  console.log('***********************************************');
  const url = `http://light-bikes.inseng.net/games/${gameId}/move?playerId=${me.id}&x=${x}&y=${y}`;

  return axios.post(url).then(r => {
    return { newState: r.data[0], distance: getDistance({x, y}, enemy) };
  });
};

module.exports = {
  move,
  newCoords
};
