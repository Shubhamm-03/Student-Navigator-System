import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaLock, FaShieldAlt } from "react-icons/fa";
import api from "../../api/axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
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
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
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
      </section>
    </div>
  );
};

export default AdminLogin;
