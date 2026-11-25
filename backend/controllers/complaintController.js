import Complaint from '../models/Complaint.js';


export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, room } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      title,
      category,
      description,
      room: room || req.user.roomNumber,
      image: imagePath,
      createdBy: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name roomNumber')
      .sort({ createdAt: -1 });

    complaints.sort((a, b) => b.meTooUsers.length - a.meTooUsers.length);

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'createdBy',
      'name email roomNumber'
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const toggleMeToo = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const userId = req.user._id.toString();
    const index = complaint.meTooUsers.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      complaint.meTooUsers.push(req.user._id);
    } else {
      complaint.meTooUsers.splice(index, 1);
    }

    await complaint.save();
    res.json({
      meTooCount: complaint.meTooUsers.length,
      meTooUsers: complaint.meTooUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // When admin marks "Resolved", shift to awaiting resident confirmation
    if (status === 'Resolved') {
      complaint.status = 'Resolved - Awaiting Confirmation';
    } else {
      complaint.status = status;
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const confirmResolution = async (req, res) => {
  try {
    const { action } = req.body; // 'confirm' or 'reopen'
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can confirm this' });
    }

    if (action === 'confirm') {
      complaint.status = 'Closed';
      complaint.resolvedAt = new Date();
    } else if (action === 'reopen') {
      complaint.status = 'Reopened';
      complaint.resolvedAt = null;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};