import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
              H
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">
              ResiTrack
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#problem" className="hover:text-indigo-600 transition">
              Problem
            </a>
            <a href="#solution" className="hover:text-indigo-600 transition">
              Solution
            </a>
            <a href="#features" className="hover:text-indigo-600 transition">
              Key Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={dashboardPath}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              Smart Hostel Maintenance Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Hostel issues fixed faster, with <span className="text-indigo-600">zero guesswork</span>.
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              A centralized platform where residents report room or facility problems in seconds—via
              QR scan or dashboard—upvote shared issues, and confirm when repairs are actually done.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={user ? '/new-complaint' : '/register'}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
              >
                Report an Issue
              </Link>
              <Link
                to="/login"
                className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Resident / Admin Login
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Live Priority Queue
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">
                Sorted by Impact
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm text-slate-800">2nd Floor Wi-Fi Router Down</p>
                <p className="text-xs text-slate-500 mt-0.5">Wi-Fi • Wing B • In Progress</p>
              </div>
              <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg shrink-0">
                ✋ 14 Me Too
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm text-slate-800">Overhead Tank Water Leakage</p>
                <p className="text-xs text-slate-500 mt-0.5">Water • Room B-204 • Awaiting Check</p>
              </div>
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full shrink-0">
                Verify Fix
              </span>
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl flex items-center justify-between text-xs">
              <span>Scan Room B-204 QR → Form opens with Room B-204 pre-filled</span>
              <span className="bg-white/10 px-2.5 py-1 rounded font-mono text-indigo-300">
                ?room=B-204
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
            The Problem Statement
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Why traditional hostel complaint handling breaks down
          </h2>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            Informal WhatsApp groups, paper registers, and one-way status updates create friction for
            both students and hostel wardens.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">1. Duplicate & Buried Complaints</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When a shared Wi-Fi or water issue hits a floor, dozens of separate messages flood in,
              making it hard for admins to see what affects the most residents first.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">2. Slow Manual Reporting</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Residents have to hunt for contact details, re-type room numbers and categories, or
              wait to visit an office just to log a routine maintenance request.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">3. Prematurely Closed Tickets</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Issues are often marked "Resolved" before a resident verifies the fix, leaving broken
              fixtures unnoticed until someone has to complain all over again.
            </p>
          </div>
        </div>
      </section>

      <section id="solution" className="bg-indigo-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
              Our Solution
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              One structured workflow for residents and wardens
            </h2>
            <p className="text-indigo-200 mt-2 text-sm md:text-base">
              ResiTrack turns scattered complaints into a prioritized, trackable, and resident-verified
              resolution loop.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-indigo-900/60 border border-indigo-800 p-6 rounded-xl">
              <div className="text-xs font-bold text-indigo-300 mb-1">STEP 01 • CAPTURE</div>
              <h3 className="font-bold text-lg mb-2">Instant Room-Aware Submission</h3>
              <p className="text-sm text-indigo-100/80 leading-relaxed">
                Submit complaints with category, room number, description, and an optional photo—or
                scan a room QR code to pre-fill the room automatically.
              </p>
            </div>

            <div className="bg-indigo-900/60 border border-indigo-800 p-6 rounded-xl">
              <div className="text-xs font-bold text-indigo-300 mb-1">STEP 02 • PRIORITIZE</div>
              <h3 className="font-bold text-lg mb-2">Impact-Driven Triage</h3>
              <p className="text-sm text-indigo-100/80 leading-relaxed">
                Admins filter by category or status while complaints with more "Me Too" votes rise
                to the top so widespread issues get immediate attention.
              </p>
            </div>

            <div className="bg-indigo-900/60 border border-indigo-800 p-6 rounded-xl">
              <div className="text-xs font-bold text-indigo-300 mb-1">STEP 03 • VERIFY</div>
              <h3 className="font-bold text-lg mb-2">Two-Way Resolution Sign-Off</h3>
              <p className="text-sm text-indigo-100/80 leading-relaxed">
                When an admin marks a complaint resolved, the resident confirms it is fixed or
                reopens it with one click if the problem persists.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            Standout Capabilities
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Built for real hostel accountability
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <span className="inline-block text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded mb-3">
              "Me Too" Button
            </span>
            <h3 className="font-bold text-slate-900 mb-2">Stop Duplicate Tickets</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Residents click "Me Too" on an existing complaint instead of filing repeats. The portal
              tracks affected users and sorts issues by highest impact.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded mb-3">
              Room QR Codes
            </span>
            <h3 className="font-bold text-slate-900 mb-2">Scan & Pre-Fill Room</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Admins generate a QR code for any room. Scanning it opens the complaint form with the
              room number already filled in via the URL query parameter.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <span className="inline-block text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-1 rounded mb-3">
              Resolution Confirmation
            </span>
            <h3 className="font-bold text-slate-900 mb-2">Confirm Fixed or Reopen</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Residents get "Confirm fixed" and "Not fixed, reopen" buttons once a fix is marked
              complete, ensuring issues stay open until truly solved.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-auto bg-white border-t py-6 px-6 text-center text-xs text-slate-500">
        ResiTrack • MERN Hostel Complaint & Maintenance Portal
      </footer>
    </div>
  );
}