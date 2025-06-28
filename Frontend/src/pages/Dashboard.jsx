import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ClickGraph from '../components/ClickGraph'; // 👈 Create this component

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatarUrl");
    setUsername(storedUsername || '');
    setAvatarUrl(storedAvatar || `https://ui-avatars.com/api/?name=${storedUsername}`);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">📌 Dashboard</h1>
        <nav className="flex flex-col gap-3">
          <NavLink to="/dashboard" className="hover:underline">My Links</NavLink>
          <NavLink to="/dashboard/add" className="hover:underline">Add New Link</NavLink>
          <NavLink to="/dashboard/settings" className="hover:underline">Settings</NavLink>
          <NavLink to="/dashboard/contacts" className="hover:underline">Contacts</NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Header with Avatar */}
        <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
          <h2 className="text-xl font-semibold">Welcome, @{username}</h2>
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border"
          />
        </div>

        <div className="p-6">
          {/* 👇 Show Graph only on /dashboard home page */}
          {location.pathname === "/dashboard" && (
            <ClickGraph username={username} />
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
