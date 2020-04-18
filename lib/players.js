const getOpponent = (me, players = []) => {
  return players.filter(p => p.color !== me.color).pop();
};

module.exports = { getOpponent };
