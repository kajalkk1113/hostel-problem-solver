import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);

  const fetchComplaint = async () => {
    try {
      const { data } = await API.get(`/complaints/${id}`);
      setComplaint(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleConfirm = async (action) => {
    await API.put(`/complaints/${id}/confirm`, { action });
    fetchComplaint();
  };

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-6 text-sm text-[#57534E]">
        Loading complaint details...
      </div>
    );
  }

  const isOwner = complaint.createdBy?._id === user?._id;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to={user?.role === 'admin' ? '/admin' : '/dashboard'}
          className="text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
        >
          ← Back to dashboard
        </Link>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E7E2DA] shadow-xs mt-4 space-y-5">
          <div className="flex flex-wrap justify-between items-start gap-3 border-b border-[#F3EFE8] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9A3412]">
                {complaint.category}
              </span>
              <h1 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                {complaint.title}
              </h1>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#F3EFE8] text-[#44403C]">
              {complaint.status}
            </span>
          </div>

          <p className="text-sm text-[#44403C] leading-relaxed">{complaint.description}</p>

          <dl className="grid grid-cols-2 gap-4 text-xs bg-[#FAF8F5] border border-[#E7E2DA] p-4 rounded-lg">
            <div>
              <dt className="text-[#78716C] uppercase tracking-wider text-[10px] font-semibold">
                Room
              </dt>
              <dd className="font-semibold text-[#1C1917] mt-0.5">{complaint.room}</dd>
            </div>
            <div>
              <dt className="text-[#78716C] uppercase tracking-wider text-[10px] font-semibold">
                Reported By
              </dt>
              <dd className="font-semibold text-[#1C1917] mt-0.5">{complaint.createdBy?.name}</dd>
            </div>
            <div>
              <dt className="text-[#78716C] uppercase tracking-wider text-[10px] font-semibold">
                Me Too Count
              </dt>
              <dd className="font-semibold text-[#1C1917] mt-0.5">
                {complaint.meTooUsers?.length || 0} residents
              </dd>
            </div>
            <div>
              <dt className="text-[#78716C] uppercase tracking-wider text-[10px] font-semibold">
                Submitted
              </dt>
              <dd className="font-semibold text-[#1C1917] mt-0.5">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>

          {complaint.image && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2">
                Attached Photo
              </p>
              <img
                src={`http://localhost:5000${complaint.image}`}
                alt="Complaint attachment"
                className="max-h-72 rounded-lg border border-[#E7E2DA] object-cover"
              />
            </div>
          )}

          {isOwner && complaint.status === 'Resolved - Awaiting Confirmation' && (
            <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#92400E]">
                Marked resolved by admin. Has the issue been fixed?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm('confirm')}
                  className="bg-[#15803D] text-white text-xs px-3.5 py-2 rounded-md font-medium hover:bg-[#166534]"
                >
                  Confirm fixed
                </button>
                <button
                  onClick={() => handleConfirm('reopen')}
                  className="bg-[#B91C1C] text-white text-xs px-3.5 py-2 rounded-md font-medium hover:bg-[#991B1B]"
                >
                  Not fixed, reopen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}