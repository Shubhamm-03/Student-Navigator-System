import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye, FaEyeSlash, FaLock, FaPalette, FaShieldAlt } from "react-icons/fa";
import api from "../../api/axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attractive, setAttractive] = useState(() => localStorage.getItem("adminLoginBg") !== "plain");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/admin/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("adminName", data.name);
      navigate("/admin/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We could not sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBackground = () => {
    const next = !attractive;
    setAttractive(next);
    localStorage.setItem("adminLoginBg", next ? "attractive" : "plain");
  };

  return (
    <div className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 top-14 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative flex items-center gap-3 text-white">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500 text-sm font-black">SNS</div>
          <div>
            <p className="font-bold">Student Navigator</p>
            <p className="text-xs tracking-widest text-indigo-300">ADMIN CONSOLE</p>
          </div>
        </div>
        <div className="relative max-w-xl">
          <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-2xl text-indigo-300 ring-1 ring-white/10">
            <FaShieldAlt />
          </div>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white">
            Keep your campus data in sync.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Manage students, classrooms, faculty, academic setup, and the weekly schedule from one focused workspace.
          </p>
        </div>
        <p className="relative text-sm text-slate-600">Student Navigator System &copy; 2026</p>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-12 sm:px-10">
        <button
          type="button"
          onClick={toggleBackground}
          aria-label={attractive ? "Switch to normal background" : "Switch to attractive background"}
          title={attractive ? "Switch to normal background" : "Switch to attractive background"}
          className="group absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition"
        >
          <FaPalette className="text-lg transition-transform duration-300 group-hover:scale-125" />
        </button>

        {attractive && (
        <>
        <style>{`
          .admin-login-tech-grid {
            background-image:
              radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.20) 1px, transparent 0),
              linear-gradient(rgba(79, 70, 229, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.07) 1px, transparent 1px);
            background-size: 28px 28px, 28px 28px, 28px 28px;
          }
          .admin-login-scanline {
            background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.10), transparent);
            animation: admin-login-scan 7s linear infinite;
          }
          @keyframes admin-login-scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          .admin-login-circuit-path {
            stroke-dasharray: 6 10;
            animation: admin-login-flow 2.5s linear infinite;
          }
          @keyframes admin-login-flow {
            to { stroke-dashoffset: -16; }
          }
        `}</style>

        <div className="pointer-events-none absolute inset-0 admin-login-tech-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/50 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-300/50 blur-3xl animate-pulse [animation-delay:1.5s]" />
          <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl animate-pulse [animation-delay:3s]" />
          <div className="absolute top-16 right-1/4 h-24 w-24 rounded-full bg-blue-200/70 blur-2xl" />
          <div className="absolute bottom-24 left-16 h-16 w-16 rounded-full bg-indigo-200/70 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border border-blue-200/80 blur-sm" />
          <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full border border-indigo-200/60 blur-sm" />
        </div>
        <div className="admin-login-scanline pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden="true" />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g fill="none" stroke="rgba(79, 70, 229, 0.30)" strokeWidth="1.5">
            <path className="admin-login-circuit-path" d="M-50 180 H380 V320 H720 V140 H1180 V420 H1500" />
            <path className="admin-login-circuit-path" d="M-50 720 H320 V560 H880 V740 H1500" />
            <path className="admin-login-circuit-path" d="M220 900 V620 H540" />
            <path className="admin-login-circuit-path" d="M1080 900 V640 H1320 V420" />
            <path className="admin-login-circuit-path" d="M-50 420 H180 V720" />
            <path className="admin-login-circuit-path" d="M1350 180 V360 H1180" />
          </g>
          <g fill="rgba(79, 70, 229, 0.45)">
            <circle cx="380" cy="320" r="4" />
            <circle cx="720" cy="140" r="4" />
            <circle cx="1180" cy="420" r="4" />
            <circle cx="320" cy="560" r="4" />
            <circle cx="880" cy="740" r="4" />
            <circle cx="540" cy="620" r="4" />
            <circle cx="1320" cy="640" r="4" />
            <circle cx="180" cy="720" r="4" />
            <circle cx="1350" cy="180" r="4" />
            <circle cx="1180" cy="360" r="4" />
          </g>
        </svg>
        </>
        )}

        <div className="relative z-10 w-full max-w-md">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-10 lg:hidden">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-sm font-black text-white">SNS</div>
            <p className="text-sm font-semibold tracking-widest text-indigo-600">ADMIN CONSOLE</p>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Sign in to manage Student Navigator.</p>
          </div>

          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <label className="mb-5 block text-sm font-semibold text-slate-700">
            Email address
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@college.edu"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>
          <label className="mb-7 block text-sm font-semibold text-slate-700">
            Password
            <div className="relative mt-2">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in securely"}
            {!loading && <FaArrowRight className="text-sm" />}
          </button>
          <p className="mt-8 text-center text-sm text-slate-500">
            Looking for the student portal?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in as a student</Link>
          </p>
        </form>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
