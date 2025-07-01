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
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center mb-6 px-4 sm:px-6 py-3 border-b bg-white rounded-md shadow-sm">
      {/* Left: Welcome */}
      <h1 className="text-lg sm:text-xl font-semibold text-gray-700">
        Welcome, <span className="text-orange-600">@{username}</span>
      </h1>

      {/* Right: Avatar + Logout */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/u/${username}`)}
          title="View public profile"
        >
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${username}`}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-orange-500 hover:scale-105 transition-transform"
          />
          <span className="font-medium hidden sm:inline text-gray-700">{user.username}</span>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
