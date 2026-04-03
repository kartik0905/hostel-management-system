const express = require('express');
const router = express.Router();
const { addRoom, getRooms, updateRoom } = require('../controllers/rooms.controllers');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('Admin'));

router.route('/')
    .post(addRoom)
    .get(getRooms);

router.route('/:id')
    .put(updateRoom);

module.exports = router;
