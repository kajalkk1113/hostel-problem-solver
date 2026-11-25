import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'resident',
    roomNumber: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await register(form);
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-[#1C1917] px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E7E2DA] shadow-xs">
        <div className="mb-6">
          <Link to="/" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
            ← Back to ResiTrack
          </Link>
          <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-3">Create account</h2>
          <p className="text-xs text-[#57534E] mt-1">
            Register as a hostel resident or warden administrator.
          </p>
        </div>

        {error && (
          <p className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] p-3 rounded-lg mb-4 text-xs">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@hostel.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
            >
              <option value="resident">Resident</option>
              <option value="admin">Admin / Warden</option>
            </select>
          </div>

          {form.role === 'resident' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
                Room Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g., B-204"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 font-mono text-sm focus:outline-none focus:border-[#C2410C]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#C2410C] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#9A3412] transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#57534E]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#C2410C] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}