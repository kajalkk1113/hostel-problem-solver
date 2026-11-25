import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ResidentDashboard() {
  const { user, logout } = useAuth();
  const [myComplaints, setMyComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);

  const fetchData = async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        API.get('/complaints/my'),
        API.get('/complaints'),
      ]);
      setMyComplaints(myRes.data);
      setAllComplaints(allRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMeToo = async (id) => {
    try {
      await API.put(`/complaints/${id}/metoo`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async (id, action) => {
    try {
      await API.put(`/complaints/${id}/confirm`, { action });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
      <header className="bg-white border-b border-[#E7E2DA] px-6 py-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C2410C]">
            ResiTrack Resident Desk
          </span>
          <h1 className="font-serif text-xl font-bold text-[#1C1917]">{user?.name}</h1>
          <p className="text-xs text-[#78716C] font-mono">Room {user?.roomNumber}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/new-complaint"
            className="bg-[#C2410C] text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-[#9A3412] transition"
          >
            + New Complaint
          </Link>
          <button
            onClick={logout}
            className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2 py-1"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">My Reported Complaints</h2>
            <span className="text-xs text-[#78716C]">{myComplaints.length} total</span>
          </div>

          {myComplaints.length === 0 ? (
            <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] text-xs text-[#57534E]">
              You have not submitted any complaints yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myComplaints.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl border border-[#E7E2DA] shadow-2xs space-y-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/complaints/${item._id}`}
                      className="font-semibold text-sm text-[#1C1917] hover:text-[#C2410C]"
                    >
                      {item.title}
                    </Link>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F3EFE8] text-[#44403C] shrink-0">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#78716C]">
                    {item.category} • <span className="font-mono">Room {item.room}</span>
                  </p>

                  {item.status === 'Resolved - Awaiting Confirmation' && (
                    <div className="mt-3 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg">
                      <p className="text-xs font-medium text-[#92400E] mb-2">
                        Admin marked this resolved. Confirm if it works:
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(item._id, 'confirm')}
                          className="bg-[#15803D] text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-[#166534]"
                        >
                          Confirm fixed
                        </button>
                        <button
                          onClick={() => handleConfirm(item._id, 'reopen')}
                          className="bg-[#B91C1C] text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-[#991B1B]"
                        >
                          Not fixed, reopen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            Active Hostel Issues
          </h2>
          <p className="text-xs text-[#57534E] mt-0.5 mb-3">
            Sorted by most affected. Click &ldquo;Me too&rdquo; if you face the same issue instead
            of filing a duplicate.
          </p>

          <div className="space-y-3">
            {allComplaints
              .filter((c) => c.status !== 'Closed')
              .map((item) => {
                const hasVoted = item.meTooUsers?.includes(user?._id);
                return (
                  <div
                    key={item._id}
                    className="bg-white p-4 rounded-xl border border-[#E7E2DA] shadow-2xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/complaints/${item._id}`}
                          className="font-semibold text-sm text-[#1C1917] hover:text-[#C2410C]"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-[#F3EFE8] text-[#44403C]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] mt-1">
                        <span className="font-mono">Room {item.room}</span> • {item.status}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMeToo(item._id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition shrink-0 ${
                        hasVoted
                          ? 'bg-[#C2410C] text-white border-[#C2410C]'
                          : 'bg-[#FAF8F5] text-[#1C1917] border-[#D6D0C4] hover:bg-[#F3EFE8]'
                      }`}
                    >
                      Me too ({item.meTooUsers?.length || 0})
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}