import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        phone,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
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
  );
};

export default Login;
