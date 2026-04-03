const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.endsWith('@geu.ac.in');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Tenant'],
        default: 'Tenant'
    },
    contactNumber: {
        type: String
    },
    roomID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);
