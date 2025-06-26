import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">📌 Dashboard</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block hover:underline">My Links</Link>
          <Link to="/dashboard/add" className="block hover:underline">Add New Link</Link>
          <Link to="/dashboard/settings" className="block hover:underline">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
