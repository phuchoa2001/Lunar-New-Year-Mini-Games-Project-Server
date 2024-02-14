const Action = require("../schema/action")

function addAction(actionData) {
  const newAction = new Action(actionData);
  return newAction.save();
}

// Function để xóa tất cả các actions
function deleteAllActions() {
  return Action.deleteMany({});
}

// Function để lấy tất cả các actions
function getAllActions() {
  return Action.find({});
}

module.exports = { addAction, deleteAllActions, getAllActions };