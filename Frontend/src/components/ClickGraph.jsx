import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const ClickGraph = ({ username }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchClicks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/links/clicks-summary/${username}`);
        setData(res.data); // Expected format: [{ title: 'GitHub', clickCount: 7 }, ...]
      } catch (err) {
        console.error("Failed to load click data", err);
      }
    };

    if (username) fetchClicks();
  }, [username]);

  if (data.length === 0) return <p className="text-center my-4 text-gray-500">No click data yet.</p>;

  return (
    <div className="bg-white shadow p-4 rounded mb-6">
      <h3 className="text-lg font-semibold mb-4">📊 Click Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="clickCount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClickGraph;
