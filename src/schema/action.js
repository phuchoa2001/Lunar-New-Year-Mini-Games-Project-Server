const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const actionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    method: { type: String, required: true }
});

module.exports = mongoose.model('actions', actionSchema);