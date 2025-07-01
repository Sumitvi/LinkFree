import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import ClickGraph from '../components/ClickGraph';
import {
  LayoutDashboard,
  Link2,
  Plus,
  Settings,
  Users,
  Shield,
  Link,
} from 'lucide-react';

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
    if (username) navigate(`//${username}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={handleProfileClick}
            />
            <div>
              <p className="font-semibold text-gray-700">Welcome</p>
              <p className="text-sm text-gray-500">{username}</p>
            </div>
          </div>

          <nav className="space-y-4 text-gray-700">
            <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />}>My Links</NavItem>
            <NavItem to="/dashboard/add" icon={<Plus size={18} />}>Add New Link</NavItem>
            <NavItem to="/dashboard/settings" icon={<Settings size={18} />}>Settings</NavItem>
            <NavItem to="/dashboard/contacts" icon={<Users size={18} />}>Contacts</NavItem>
            <NavItem to="/dashboard/protected-links" icon={<Shield size={18} />}>Protected Links</NavItem>
            <NavItem to="/dashboard/shorten" icon={<Link2 size={18} />}>Shorten URL</NavItem>
          </nav>
        </div>

        <div className="text-xs text-gray-400 text-center mt-4">
          © 2025 LinkFree
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 bg-white">
        <DashboardHeader />

        {/* Show Click Graph only on /dashboard */}
        {location.pathname === "/dashboard" && (
          <div className="mb-8">
            <ClickGraph username={username} />
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

// Reusable NavItem component
const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive ? 'bg-orange-100 text-orange-600 font-medium' : 'hover:bg-gray-100'
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);

export default DashboardLayout;
