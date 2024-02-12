const Goal = require('../schema/goal'); 

function checkUpdateTime(req, res, next) {
  Goal.findById(req.params.id, (err, goal) => {
    if (err) return res.status(500).send(err);
    if (!goal) return res.status(404).send('Goal not found');

    const currentTime = new Date();
    const createTime = goal.createdAt;
    const timeDiff = (currentTime - createTime) / (1000 * 60 * 60); // Chuyển đổi thời gian từ milliseconds sang hours

    if (timeDiff > 24) {
      return res.status(403).send('Cannot update or delete after 24 hours');
    } else {
      next();
    }
  });
}

module.exports = checkUpdateTime;