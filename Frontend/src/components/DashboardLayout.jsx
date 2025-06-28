import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import ClickGraph from '../components/ClickGraph';

const DashboardLayout = () => {
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

  const handleProfileClick = () => {
    if (username) navigate(`/user/${username}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">📌 Dashboard</h1>
          <nav className="flex flex-col gap-3">
            <NavLink to="/dashboard" className="hover:underline">My Links</NavLink>
            <NavLink to="/dashboard/add" className="hover:underline">Add New Link</NavLink>
            <NavLink to="/dashboard/settings" className="hover:underline">Settings</NavLink>
            <NavLink to="/dashboard/contacts" className="hover:underline">Contacts</NavLink>
            <NavLink to="/dashboard/qr" className="hover:underline">QR Codes</NavLink>

          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <DashboardHeader />

        {/* 👇 Show Click Graph only on /dashboard */}
        {location.pathname === "/dashboard" && (
          <div className="mb-8">
            {/* <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1> */}
            <ClickGraph username={username} />
          </div>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
