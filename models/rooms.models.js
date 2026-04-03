const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    rentPerBed: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Room', roomSchema);
