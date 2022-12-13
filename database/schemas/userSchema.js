const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: false,
        default: 0
    },
    daysPlayed: {
        type: Number,
        required: false,
        default: 0
    },
    correctAnswers: {
        type: Number,
        required: false,
        default: 0
    }
},);

module.exports = mongoose.model('Users', userSchema);