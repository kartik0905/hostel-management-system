const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaint } = require('../controllers/complaints.controllers');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .post(authorize('Tenant'), createComplaint)
    .get(getComplaints);

router.route('/:id')
    .put(authorize('Admin'), updateComplaint);

module.exports = router;
