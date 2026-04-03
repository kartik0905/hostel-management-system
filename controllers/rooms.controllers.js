const Room = require('../models/rooms.models');

const addRoom = async (req, res, next) => {
    try {
        const { roomNumber, capacity, rentPerBed } = req.body;
        
        const roomExists = await Room.findOne({ roomNumber });
        if (roomExists) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const room = await Room.create({
            roomNumber,
            capacity,
            rentPerBed
        });

        res.status(201).json(room);
    } catch (error) {
        next(error);
    }
};

const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        next(error);
    }
};

const updateRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        next(error);
    }
};

module.exports = { addRoom, getRooms, updateRoom };
