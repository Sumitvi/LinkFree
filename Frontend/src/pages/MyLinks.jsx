import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserLinks } from '../services/api';
import LinkRow from '../components/LinkRow';
import AddLink from '../components/AddLink';
import AnalyticsChart from '../components/AnalyticsChart';

const MyLinks = () => {
  const [links, setLinks] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const username = localStorage.getItem("username");

  // Fetch all links and analytics for the first one
  const fetchLinks = async () => {
    try {
      const data = await getUserLinks(username);
      setLinks(data);

      if (data.length > 0) {
        const firstLinkId = data[0].id;

        const res = await axios.get(`http://localhost:8080/api/links/analytics/${firstLinkId}/last28days`);
        const chartData = res.data.map((entry) => ({
          day: entry.date || entry.day,
          clicks: entry.count || entry.clicks,
        }));

        setAnalyticsData(chartData);
      } else {
        setAnalyticsData([]); // Clear if no links
      }
    } catch (err) {
      console.error("Failed to load links or analytics", err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = (deletedId) => {
    setLinks((prev) => prev.filter((link) => link.id !== deletedId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Links</h1>

      {/* 📊 Analytics Chart */}
      {analyticsData.length > 0 && (
        <div className="mb-6">
          <AnalyticsChart data={analyticsData} />
        </div>
      )}

      {/* ➕ Add Link Form */}
      <AddLink username={username} onLinkAdded={fetchLinks} />

      {/* 📋 Links Table */}
      {links.length === 0 ? (
        <p className="mt-4 text-gray-500">No links found. Add some!</p>
      ) : (
        <table className="w-full border mt-6">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">URL</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                onDelete={handleDelete}
                onUpdate={fetchLinks}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLinks;
