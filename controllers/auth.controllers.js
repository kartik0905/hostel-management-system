const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users.models');
const Room = require('../models/rooms.models');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, contactNumber, roomID } = req.body;

        if (!email.endsWith('@geu.ac.in')) {
            return res.status(400).json({ message: 'Email must end with @geu.ac.in' });
        }

        const userExists = await User.findOne({ 
            $or: [{ email }, { name }] 
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (roomID) {
            const room = await Room.findById(roomID);
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
            if (room.currentOccupancy >= room.capacity) {
                return res.status(400).json({ message: 'Room is at full capacity' });
            }
            
            room.currentOccupancy += 1;
            await room.save();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'Tenant',
            contactNumber,
            roomID: roomID || null
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
