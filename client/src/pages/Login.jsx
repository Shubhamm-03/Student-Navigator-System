import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPalette } from "react-icons/fa";
import api from "../api/axios";
import bbdLogo from "../assets/logo-BBD.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [attractive, setAttractive] = useState(() => localStorage.getItem("loginBg") !== "plain");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        phone,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleBackground = () => {
    const next = !attractive;
    setAttractive(next);
    localStorage.setItem("loginBg", next ? "attractive" : "plain");
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col px-4 py-8 overflow-hidden ${
        attractive
          ? "bg-gradient-to-br from-blue-100 via-indigo-100 to-slate-200"
          : "bg-gray-100"
      }`}
    >
      {attractive && (
        <>
          <style>{`
            .login-tech-grid {
              background-image:
                radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.22) 1px, transparent 0),
                linear-gradient(rgba(79, 70, 229, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(79, 70, 229, 0.08) 1px, transparent 1px);
              background-size: 28px 28px, 28px 28px, 28px 28px;
              mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.95));
              -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.95));
            }
            .login-scanline {
              background: linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.10), transparent);
              animation: login-scan 7s linear infinite;
            }
            @keyframes login-scan {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100vh); }
            }
            .login-circuit-path {
              stroke-dasharray: 6 10;
              animation: login-flow 2.5s linear infinite;
            }
            @keyframes login-flow {
              to { stroke-dashoffset: -16; }
            }
          `}</style>

          <div className="pointer-events-none absolute inset-0 login-tech-grid" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300/50 blur-3xl animate-pulse" />
            <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-indigo-300/50 blur-3xl animate-pulse [animation-delay:1.5s]" />
            <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl animate-pulse [animation-delay:3s]" />
            <div className="absolute top-16 right-1/4 h-24 w-24 rounded-full bg-blue-200/70 blur-2xl" />
            <div className="absolute bottom-24 left-16 h-16 w-16 rounded-full bg-indigo-200/70 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full border border-blue-200/80 blur-sm" />
            <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full border border-indigo-200/60 blur-sm" />
          </div>
          <div className="login-scanline pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden="true" />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g fill="none" stroke="rgba(79, 70, 229, 0.35)" strokeWidth="1.5">
              <path className="login-circuit-path" d="M-50 180 H380 V320 H720 V140 H1180 V420 H1500" />
              <path className="login-circuit-path" d="M-50 720 H320 V560 H880 V740 H1500" />
              <path className="login-circuit-path" d="M220 900 V620 H540" />
              <path className="login-circuit-path" d="M1080 900 V640 H1320 V420" />
              <path className="login-circuit-path" d="M-50 420 H180 V720" />
              <path className="login-circuit-path" d="M1350 180 V360 H1180" />
            </g>
            <g fill="rgba(79, 70, 229, 0.5)">
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

      <div className="relative z-10 flex justify-end">
        <button
          type="button"
          onClick={toggleBackground}
          aria-label={attractive ? "Switch to normal background" : "Switch to attractive background"}
          title={attractive ? "Switch to normal background" : "Switch to attractive background"}
          className="group grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition"
        >
          <FaPalette className="text-lg transition-transform duration-300 group-hover:scale-125" />
        </button>
      </div>

      <img
        src={bbdLogo}
        alt="BBD University"
        className="relative z-10 mx-auto w-56 h-auto object-contain sm:w-72 md:w-96"
      />
      <div className="relative z-10 flex flex-1 items-center justify-center">
      <div className={`w-full max-w-sm ${attractive ? "rounded-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400/70 p-[1.5px] shadow-2xl shadow-indigo-400/40" : ""}`}>
      <form
        onSubmit={handleLogin}
        className={`p-8 w-full max-w-sm ${
          attractive
            ? "rounded-xl bg-white/70 backdrop-blur-xl"
            : "bg-white shadow-lg rounded-lg"
        }`}
      >
        <h1
          className={`text-3xl text-center mb-2 font-bold tracking-wide ${
            attractive ? "text-slate-900" : "text-slate-900"
          }`}
          style={{ fontFamily: "'Arial Black', 'Impact', 'Arial Bold', sans-serif", fontWeight: 700, letterSpacing: "0.5px" }}
        >
          Student Navigator System
        </h1>
        {attractive && (
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        )}

        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`w-full border rounded-md p-3 mb-4 outline-none placeholder:text-slate-400 focus:border-blue-500 ${
            attractive
              ? "border-indigo-200 bg-white/60 backdrop-blur transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              : "border-slate-300"
          }`}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-3 rounded-md disabled:cursor-not-allowed disabled:opacity-60 ${
            attractive
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-lg shadow-indigo-500/40 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-indigo-500/60"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={`mt-5 text-center text-sm ${attractive ? "text-slate-600" : "text-slate-500"}`}>
          Are you an administrator?{" "}
          <Link to="/admin/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Open the admin console
          </Link>
        </p>
      </form>
      </div>
      </div>
      <p className="relative z-10 mt-8 text-center text-sm text-slate-500">
        Developed by{" "}
        <a
          href="https://github.com/Shubhamm-03"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-slate-700 hover:text-blue-600 transition"
        >
          Shubham
        </a>
      </p>
    </div>
  );
};

export default Login;
