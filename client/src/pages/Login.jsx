import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import bbdLogo from "../assets/logo-BBD.png";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 px-4 py-8">
      <img
        src={bbdLogo}
        alt="BBD University"
        className="mx-auto w-96 h-auto object-contain"
      />
      <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
      >
        <h1
          className="text-3xl text-center mb-6 font-semibold tracking-wide"
          style={{ fontFamily: "'Cambria', Georgia, 'Times New Roman', serif" }}
        >
          Student Navigator System
        </h1>

        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-md p-3 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Are you an administrator?{" "}
          <Link to="/admin/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Open the admin console
          </Link>
        </p>
      </form>
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
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
