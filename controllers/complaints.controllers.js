const Complaint = require('../models/complaints.models');

const createComplaint = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const complaint = await Complaint.create({
            tenantId: req.user.id,
            title,
            description
        });

        res.status(201).json(complaint);
    } catch (error) {
        next(error);
    }
};

const getComplaints = async (req, res, next) => {
    try {
        let complaints;
        if (req.user.role === 'Admin') {
            complaints = await Complaint.find({}).populate('tenantId', 'name email');
        } else {
            complaints = await Complaint.find({ tenantId: req.user.id });
        }
        res.json(complaints);
    } catch (error) {
        next(error);
    }
};

const updateComplaint = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'In-Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.json(complaint);
    } catch (error) {
        next(error);
    }
};

module.exports = { createComplaint, getComplaints, updateComplaint };
