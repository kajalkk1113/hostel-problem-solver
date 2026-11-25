import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrRoom, setQrRoom] = useState('A-101');
  const qrCanvasRef = useRef(null);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints', {
        params: { category: categoryFilter, status: statusFilter },
      });
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const downloadQR = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `Room-${qrRoom}-QR.png`;
    link.click();
  };

  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Reopened'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Closed').length;

  const closedWithDates = complaints.filter((c) => c.status === 'Closed' && c.resolvedAt);
  const avgDays =
    closedWithDates.length > 0
      ? (
          closedWithDates.reduce((acc, c) => {
            const diff = new Date(c.resolvedAt) - new Date(c.createdAt);
            return acc + diff / (1000 * 60 * 60 * 24);
          }, 0) / closedWithDates.length
        ).toFixed(1)
      : '—';

  const qrLink = `${window.location.origin}/new-complaint?room=${encodeURIComponent(qrRoom)}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <header className="bg-white border-b border-[#E7E2DA] px-6 py-4 flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C2410C]">
            ResiTrack Warden Console
          </span>
          <h1 className="font-serif text-xl font-bold text-[#1C1917]">{user?.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQRModal(true)}
            className="bg-[#1C1917] text-[#FAF8F5] px-4 py-2 rounded-md text-xs font-medium hover:bg-[#292524]"
          >
            Room QR Generator
          </button>
          <button
            onClick={logout}
            className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2 py-1"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E7E2DA]">
            <p className="text-xs text-[#78716C] font-medium">Total Complaints</p>
            <p className="font-serif text-2xl font-bold text-[#1C1917] mt-1">{totalCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7E2DA]">
            <p className="text-xs text-[#9A3412] font-medium">Pending / Reopened</p>
            <p className="font-serif text-2xl font-bold text-[#9A3412] mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7E2DA]">
            <p className="text-xs text-[#15803D] font-medium">Confirmed Closed</p>
            <p className="font-serif text-2xl font-bold text-[#15803D] mt-1">{resolvedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E7E2DA]">
            <p className="text-xs text-[#57534E] font-medium">Avg. Resolution</p>
            <p className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
              {avgDays} {avgDays !== '—' && <span className="text-xs font-sans font-normal">days</span>}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-xs font-medium text-[#57534E] mr-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-[#D6D0C4] bg-[#FAF8F5] rounded-md px-3 py-1.5 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Water">Water</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Electricity">Electricity</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#57534E] mr-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#D6D0C4] bg-[#FAF8F5] rounded-md px-3 py-1.5 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved - Awaiting Confirmation">Awaiting Confirmation</option>
              <option value="Reopened">Reopened</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl border border-[#E7E2DA] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E7E2DA] bg-[#FAF8F5] text-[11px] text-[#78716C] uppercase tracking-wider">
                <th className="p-4">Issue</th>
                <th className="p-4">Room</th>
                <th className="p-4">Category</th>
                <th className="p-4">Me Too</th>
                <th className="p-4">Status</th>
                <th className="p-4">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFE8] text-sm">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-xs text-[#78716C]">
                    No complaints match the active filters.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF8F5]">
                    <td className="p-4">
                      <Link
                        to={`/complaints/${c._id}`}
                        className="font-semibold text-[#1C1917] hover:text-[#C2410C]"
                      >
                        {c.title}
                      </Link>
                      <p className="text-xs text-[#78716C]">
                        {c.createdBy?.name} • {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4 font-mono text-xs font-semibold">{c.room}</td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded bg-[#F3EFE8] text-[#44403C]">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FFEDD5] text-[#9A3412]">
                        {c.meTooUsers?.length || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          c.status === 'Reopened'
                            ? 'bg-[#FEE2E2] text-[#991B1B]'
                            : c.status === 'Closed'
                            ? 'bg-[#DCFCE7] text-[#166534]'
                            : 'bg-[#FEF3C7] text-[#92400E]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={
                          c.status === 'Resolved - Awaiting Confirmation' ? 'Resolved' : c.status
                        }
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className="border border-[#D6D0C4] bg-white rounded-md px-2.5 py-1.5 text-xs font-medium"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Mark Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showQRModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-[#E7E2DA] max-w-sm w-full p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Room QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-[#78716C] hover:text-[#1C1917] text-lg"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-[#57534E]">
              Scanning pre-fills the room parameter on the complaint form.
            </p>
            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">Room Number</label>
              <input
                type="text"
                value={qrRoom}
                onChange={(e) => setQrRoom(e.target.value)}
                className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-md px-3 py-2 text-sm"
                placeholder="e.g., B-204"
              />
            </div>
            <div
              ref={qrCanvasRef}
              className="flex flex-col items-center justify-center p-4 bg-[#FAF8F5] rounded-lg border border-[#E7E2DA]"
            >
              <QRCodeCanvas value={qrLink} size={172} />
              <p className="mt-2 font-mono text-xs font-semibold text-[#1C1917]">Room {qrRoom}</p>
            </div>
            <p className="text-[11px] font-mono text-[#78716C] break-all">{qrLink}</p>
            <div className="flex gap-2">
              <button
                onClick={downloadQR}
                className="flex-1 bg-[#C2410C] text-white py-2 rounded-md text-xs font-medium hover:bg-[#9A3412]"
              >
                Download PNG
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2 border border-[#D6D0C4] rounded-md text-xs text-[#44403C]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}