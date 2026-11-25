import express from 'express';
import {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  toggleMeToo,
  updateComplaintStatus,
  confirmResolution,
} from '../controllers/complaintController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getComplaints)
  .post(protect, upload.single('image'), createComplaint);

router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id/metoo', protect, toggleMeToo);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);
router.put('/:id/confirm', protect, confirmResolution);

export default router;