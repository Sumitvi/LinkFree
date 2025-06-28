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

  if (!user) return null;

  return (
    <div className="flex justify-end items-center p-4 bg-white shadow">

      <h2 className="text-xl font-semibold flex justify-between items-center px-6 py-4 left-70 absolute" >Welcome, @{username}</h2>
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
    </div>
  );
};

export default DashboardHeader;
