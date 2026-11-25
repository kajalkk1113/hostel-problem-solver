import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search}`
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-[#1C1917] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E7E2DA] shadow-xs">
        <div className="mb-6">
          <Link to="/" className="text-xs font-medium text-[#78716C] hover:text-[#1C1917]">
            ← Back to ResiTrack
          </Link>
          <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-3">Sign in</h2>
          <p className="text-xs text-[#57534E] mt-1">
            Access your resident or warden workspace.
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
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
              placeholder="resident@hostel.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D6D0C4] bg-[#FAF8F5] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#C2410C]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C2410C] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#9A3412] transition"
          >
            Continue
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#57534E]">
          Need an account?{' '}
          <Link to="/register" className="text-[#C2410C] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}