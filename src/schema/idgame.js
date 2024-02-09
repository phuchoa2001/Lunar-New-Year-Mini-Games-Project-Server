const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const idGameSchema = new mongoose.Schema({
  idUser: { type: String, required: true  },
  confirmUser: { type: String, required: true },
});

module.exports = mongoose.model('idgames', idGameSchema);