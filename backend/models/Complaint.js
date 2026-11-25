import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Water', 'Wi-Fi', 'Electricity', 'Cleaning', 'Other'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '', 
    },
    room: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'In Progress',
        'Resolved - Awaiting Confirmation',
        'Closed',
        'Reopened',
      ],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    meTooUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint",complaintSchema)

export default Complaint;