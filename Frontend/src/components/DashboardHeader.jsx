import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    fetchUser();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("avatarUrl");

    axios.defaults.headers.common["Authorization"] = ""; // ✅ Clear auth header
    navigate("/login"); // ✅ Redirect to login
  };

  if (!user) return null;

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">

      <h2 className="text-xl font-semibold px-6 py-2">
        Welcome, @{username}
      </h2>

      <div className="flex items-center gap-4">
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => navigate(`/u/${username}`)}
          title="View public profile"
        >
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${username}`}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-105 transition"
          />
          <span className="font-medium hidden sm:inline">{user.username}</span>
        </div>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
