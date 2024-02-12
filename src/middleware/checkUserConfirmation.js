const IdGame = require('../schema/idgame');
const Goal = require('../schema/goal');

const checkUserConfirmation = (req, res, next) => {
  const { confirmUser, idUser } = req.body;
  const idGame = req.params.id;
  IdGame.findOne({
    confirmUser: confirmUser
  }, (err, game) => {
    if (err) return res.status(500).send(err);
    if (!game) return res.status(404).send('Game not found');
    Goal.findById(idGame, (err, goal) => {
      if (goal.idUser !== game.idUser) {
        return res.status(403).send('User not authorized to modify this game');
      } else {
        next();
      }
    })
  });
};

module.exports = checkUserConfirmation;
