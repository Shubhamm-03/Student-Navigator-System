import { useState } from "react";
import {
  FaBuilding,
  FaColumns,
  FaDoorOpen,
  FaExclamationTriangle,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const FindRoom = () => {
  const [roomNo, setRoomNo] = useState("");
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchRoom = async (event) => {
    event?.preventDefault();

    const query = roomNo.trim();

    if (!query) {
      setRoom(null);
      setError("Please enter a room number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/rooms/search/${query}`);
      setRoom(res.data.room);
    } catch {
      setRoom(null);
      setError("Room not found. Check the room number and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          <FaSearch className="text-indigo-500" /> Find Classroom
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Locate any classroom by its room number.
        </p>
      </div>

      {/* Search Card */}
      <form
        onSubmit={searchRoom}
        className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-8"
      >
        <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Room Number
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <FaDoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. B-204"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 py-3.5 pl-11 pr-4 text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300"
          >
            <FaExclamationTriangle />
            {error}
          </div>
        )}
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader />
          <p className="text-slate-500 dark:text-slate-400">
            Searching for room...
          </p>
        </div>
      )}

      {/* Result */}
      {!loading && room && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-6 text-white sm:px-8">
            <p className="text-xs uppercase tracking-[4px] opacity-90">
              Classroom Found
            </p>
            <h2 className="mt-1 break-words text-4xl font-black sm:text-5xl">
              Room {room.roomNo}
            </h2>
          </div>

          <div className="p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                <FaBuilding className="text-xl text-indigo-500" />
                <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">
                  Block
                </p>
                <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {room.block}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                <FaLayerGroup className="text-xl text-indigo-500" />
                <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">
                  Floor
                </p>
                <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {room.floor}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
                <FaColumns className="text-xl text-indigo-500" />
                <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">
                  Wing
                </p>
                <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">
                  {room.wing}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

    </MainLayout>
  );
};

export default FindRoom;
