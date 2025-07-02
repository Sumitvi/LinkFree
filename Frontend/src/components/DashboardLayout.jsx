import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import ClickGraph from '../components/ClickGraph';
import { LogOut } from 'lucide-react';

import {
  LayoutDashboard,
  Link2,
  Plus,
  Settings,
  Users,
  Shield,
  Link,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);


  

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
    <div className="flex min-h-screen bg-gray-50 relative">
     
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>


      <aside className="w-64 bg-white shadow-md p-6 hidden md:flex flex-col justify-between">
        <SidebarContent
          avatarUrl={avatarUrl}
          username={username}
          handleProfileClick={handleProfileClick}
        />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-md p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              avatarUrl={avatarUrl}
              username={username}
              handleProfileClick={handleProfileClick}
              closeSidebar={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}


      <main className="flex-1 p-4 sm:p-6 bg-white">
        <DashboardHeader />

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

const SidebarContent = ({ avatarUrl, username, handleProfileClick, closeSidebar }) => (
  <>
    <div>
      {/* <div className="flex items-center gap-3 mb-8">
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
      </div> */}

    <div className="flex items-center gap-2">
  <img
    src="https://bcassetcdn.com/public/blog/wp-content/uploads/2023/02/28141228/orange-abstract-letter-a-by-bryad-brandcrowd.png"
    alt="LinkFree Logo"
    className="h-8 w-8 object-contain"
  />
  <h1 className="text-xl font-bold text-orange-600 tracking-wide">LinkFree</h1>
</div>


      <nav className="space-y-4 text-gray-700 mt-10">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} onClick={closeSidebar}>My Links</NavItem>
        <NavItem to="/dashboard/add" icon={<Plus size={18} />} onClick={closeSidebar}>Add New Link</NavItem>
        <NavItem to="/dashboard/contacts" icon={<Users size={18} />} onClick={closeSidebar}>Contacts</NavItem>
        <NavItem to="/dashboard/protected-links" icon={<Shield size={18} />} onClick={closeSidebar}>Protected Links</NavItem>
        <NavItem to="/dashboard/shorten" icon={<Link2 size={18} />} onClick={closeSidebar}>Shorten URL</NavItem>
        <NavItem to="/dashboard/settings" icon={<Settings size={18} />} onClick={closeSidebar}>Settings</NavItem>
        {/* <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-red-100 text-red-600 w-full"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button> */}
      </nav>
    </div>

    <div className="text-xs text-gray-400 text-center mt-4">
      © 2025 LinkFree
    </div>
  </>
);


const NavItem = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-orange-100 text-orange-600 font-medium' : 'hover:bg-gray-100'
      }`
    }
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);


  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("username");
  //   localStorage.removeItem("avatarUrl");
  //   axios.defaults.headers.common["Authorization"] = "";
  //   navigate("/login");
  // };
export default DashboardLayout;
