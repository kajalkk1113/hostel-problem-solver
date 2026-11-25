import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NewComplaint() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wi-Fi');
  const [room, setRoom] = useState(user?.roomNumber || '');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qrRoom = searchParams.get('room');
    if (qrRoom) {
      setRoom(qrRoom);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('room', room);
      formData.append('description', description);
      if (image) formData.append('image', image);

      await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          to="/dashboard"
          className="text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#E7E2DA] shadow-xs mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3EFE8] pb-4 mb-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C2410C]">
                ResiTrack Intake
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                Report an Issue
              </h2>
            </div>

            {searchParams.get('room') && (
              <span className="text-xs font-medium bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] px-2.5 py-1 rounded-full">
                QR Room Pre-Filled
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
                Issue Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 2nd Floor Wi-Fi router down"
                className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
                >
                  <option value="Water">Water</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
                  Room / Area
                </label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g., B-204"
                  className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 font-mono text-sm focus:outline-none focus:border-[#C2410C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
                Description
              </label>
              <textarea
                rows="3"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened and when you noticed it..."
                className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
                Optional Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-xs text-[#57534E] file:mr-3 file:py-2 file:px-3.5 file:rounded-md file:border file:border-[#D6D0C4] file:bg-[#F3EFE8] file:text-[#1C1917] file:font-medium hover:file:bg-[#E7E2DA]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C2410C] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#9A3412] transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}