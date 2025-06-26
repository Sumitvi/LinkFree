import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">📌 Dashboard</h1>
        <nav className="flex flex-col gap-3">
          <NavLink to="/dashboard" className="hover:underline">My Links</NavLink>
          <NavLink to="/dashboard/add" className="hover:underline">Add New Link</NavLink>
          <NavLink to="/dashboard/settings" className="hover:underline">Settings</NavLink>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
