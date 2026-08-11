import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCamera,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSave,
  FaUser,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const UpdatePhoto = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [student, setStudent] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isActive = true;

    api.get("/students/profile")
      .then((res) => {
        if (isActive) {
          setStudent(res.data.student);
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

  const initials = student?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      setSuccess("");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!preview || !preview.startsWith("data:image/")) {
      setError("Please choose an image first.");
      return;
    }

    setSaving(true);

    try {
      const res = await api.put("/students/profile/photo", { photo: preview });
      setStudent(res.data.student);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile photo.");
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

        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          <FaCamera className="text-indigo-500" /> Update Profile Photo
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Upload a new photo or change your current one.
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
              Change Photo
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Your new photo appears on your profile everywhere.
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6 p-8 text-center">

            {/* Preview */}
            <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-indigo-100 bg-gradient-to-r from-indigo-500 to-violet-600 shadow-xl dark:border-slate-700 flex items-center justify-center text-4xl font-bold text-white">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : student?.profilePhoto ? (
                <img src={student.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span>{initials || <FaUser className="text-3xl" />}</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-8 text-slate-500 dark:text-slate-400 transition hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
            >
              <FaCamera className="text-2xl" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Click to choose an image
              </span>
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              PNG, JPG, WEBP or GIF. Maximum size 2 MB.
            </p>

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
                disabled={saving || !preview}
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

export default UpdatePhoto;
