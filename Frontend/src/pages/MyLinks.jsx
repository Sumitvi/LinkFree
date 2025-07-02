import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserLinks } from '../services/api';
import LinkRow from '../components/LinkRow';
import AddLink from '../components/AddLink';
import AnalyticsChart from '../components/AnalyticsChart';
import FlashMessage from '../components/FlashMessage'; 
import { Link2, BarChart } from 'lucide-react';

const MyLinks = () => {
  const [links, setLinks] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [flash, setFlash] = useState({ message: '', type: '' }); 

  const username = localStorage.getItem("username");

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
        setAnalyticsData([]);
      }
    } catch (err) {
      setFlash({ message: 'Failed to load links or analytics', type: 'error' });
      console.error("Failed to load links or analytics", err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = (deletedId) => {
    setLinks((prev) => prev.filter((link) => link.id !== deletedId));
    setFlash({ message: 'Link deleted successfully', type: 'success' });
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm gap-20">

      <FlashMessage
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: '', type: '' })}
      />

      <h1 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
        <Link2 className="text-orange-500" /> My Links
      </h1>

      {analyticsData.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BarChart className="text-orange-500" /> Click Analytics (Last 28 Days)
          </h2>
          <AnalyticsChart data={analyticsData} />
        </div>
      )}

      <AddLink username={username} onLinkAdded={() => {
        fetchLinks();
        setFlash({ message: 'Link added successfully', type: 'success' });
      }} />

      {links.length === 0 ? (
        <p className="mt-6 text-center text-gray-500">No links found. Add your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onDelete={handleDelete}
              onUpdate={() => {
                fetchLinks();
                setFlash({ message: 'Link updated successfully', type: 'success' });
              }}
              setFlash={setFlash}
              useCard
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLinks;
