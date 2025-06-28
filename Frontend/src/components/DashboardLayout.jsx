import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatarUrl");
    setUsername(storedUsername);
    setAvatarUrl(storedAvatar || `https://ui-avatars.com/api/?name=${storedUsername}`);
  }, []);

  const handleProfileClick = () => {
    if (username) navigate(`/user/${username}`);
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">📌 Dashboard</h1>
          <nav className="flex flex-col gap-3">
            <NavLink to="/dashboard" className="hover:underline">My Links</NavLink>
            <NavLink to="/dashboard/add" className="hover:underline">Add New Link</NavLink>
            <NavLink to="/dashboard/settings" className="hover:underline">Settings</NavLink>
            <NavLink to="/dashboard/contacts" className="hover:underline">Contacts</NavLink>

          </nav>
        </div>

       
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">
        <DashboardHeader /> 
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
