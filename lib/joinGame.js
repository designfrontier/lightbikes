const axios = require('axios');

const join = async id => {
  return axios.post(`http://light-bikes.inseng.net/games/${id}/join?name=dsellers`, {
    gameId: id,
    name: 'Mal Reynolds'
  })
    .then(res => {
      return res.data[0];
    });
};


const create = async (difficulty = 1, bot) => {
  const url = bot ?
    `http://light-bikes.inseng.net/games?addServerBot=true&serverBotDifficulty=${difficulty}`:
    'http://light-bikes.inseng.net/games' ;

  return axios.post(url)
    .then(res => {
      console.log(`-------------------------------------------------------`);
      console.log(`GAME CREATED: ${res.data.id}`);
      console.log(`-------------------------------------------------------`);

      return res.data.id;
    });
}

module.exports = {
  join,
  create
}
