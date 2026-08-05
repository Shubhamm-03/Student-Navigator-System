import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";

const FindRoom = () => {

  const [roomNo, setRoomNo] = useState("");

  const [room, setRoom] = useState(null);

  const searchRoom = async () => {

    try {

      const res = await api.get(`/rooms/search/${roomNo}`);

      setRoom(res.data.room);

    } catch {

      alert("Room not found");

      setRoom(null);

    }

  };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Find Classroom
      </h1>

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter Room Number"
          value={roomNo}
          onChange={(e) => setRoomNo(e.target.value)}
          className="border rounded-lg p-3 w-72"
        />

        <button
          onClick={searchRoom}
          className="bg-blue-600 text-white px-6 rounded-lg"
        >
          Search
        </button>

      </div>

      {room && (

        <div className="bg-white rounded-xl shadow-lg p-6 mt-8 max-w-lg">

          <h2 className="text-2xl font-bold mb-5">

            Room {room.roomNo}

          </h2>

          <p>
            🏢 Block : {room.block}
          </p>

          <p>
            🪽 Wing : {room.wing}
          </p>

          <p>
            🏬 Floor : {room.floor}
          </p>

        </div>

      )}

    </MainLayout>

  );

};

export default FindRoom;
