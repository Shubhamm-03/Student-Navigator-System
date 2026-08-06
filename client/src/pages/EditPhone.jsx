import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaSave,
  FaUserCheck,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const EditPhone = () => {
  const navigate = useNavigate();

  const [currentPhone, setCurrentPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isActive = true;

    api.get("/students/profile")
      .then((res) => {
        if (isActive) {
          setCurrentPhone(res.data.student.phone);
          setNewPhone(res.data.student.phone);
        }
      })
      .catch((err) => {
        if (isActive) {
          setError("Failed to load your profile. Please try again.");
          console.log(err);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const phone = newPhone.trim();
    const confirm = confirmPhone.trim();

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (phone !== confirm) {
      setError("Phone numbers do not match. Please check and try again.");
      return;
    }

    if (phone === currentPhone) {
      setError("New phone number is the same as your current phone number.");
      return;
    }

    setSaving(true);

    try {
      const res = await api.put("/students/profile/phone", { phone });

      setCurrentPhone(res.data.student.phone);
      setSuccess(res.data.message);
      setConfirmPhone("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update phone number.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>

      {/* Page Header */}
      <div className="mb-8">
        <Link
          to="/profile"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-700"
        >
          <FaArrowLeft /> Back to Profile
        </Link>

        <h1 className="flex items-center gap-3 text-4xl font-bold text-slate-900 dark:text-white">
          <FaPhoneAlt className="text-indigo-500" /> Edit Phone Number
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Update the phone number linked to your account.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader />
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Loading profile...
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 py-8 text-center text-white">
            <p className="text-xs uppercase tracking-[4px] opacity-90">
              Change Phone
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Your new phone number will be used for login.
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-8 text-center">

            {/* Current Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Current Phone Number
              </label>
              <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 text-slate-900 dark:text-white">
                <FaUserCheck className="text-green-600" />
                <span className="font-semibold">{currentPhone}</span>
              </div>
            </div>

            {/* New Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                New Phone Number
              </label>
              <div className="relative mx-auto max-w-md">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Enter 10-digit phone number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3.5 pl-11 pr-4 text-center text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Confirm Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Phone Number
              </label>
              <div className="relative mx-auto max-w-md">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Re-enter new phone number"
                  value={confirmPhone}
                  onChange={(e) => setConfirmPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3.5 pl-11 pr-4 text-center text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
              >
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300"
              >
                <FaCheckCircle />
                {success}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-row-reverse">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-600 px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

    </MainLayout>
  );
};

export default EditPhone;
