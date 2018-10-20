const mongoose = require('mongoose');

// Schema setup
const voteSchema = new mongoose.Schema({
    os: { type: String, required: true },
    points: { type: String, required: true }
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;