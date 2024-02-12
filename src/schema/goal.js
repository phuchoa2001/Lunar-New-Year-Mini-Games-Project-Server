const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { GOAL_STATUS } = require("../contants/Goal");

const goalSchema = new Schema({
  idGame: { type: String, required: true },
  target: { type: String, required: true },
  note: { type: String },
  likes: { type: Number, default: 0 },
  status: { type: Number, default: 2, required: true, enum: Object.keys(GOAL_STATUS).map(key => parseInt(key)) },
  inGame: { type: String, required: true, enum: ["Avatar 3x", "Avatar HD"] },
  idUser: { type: String, required: true },
} , { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
