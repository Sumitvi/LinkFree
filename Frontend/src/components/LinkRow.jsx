import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getLinkAnalytics } from '../services/api';

const LinkRow = ({ link, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentClicks, setRecentClicks] = useState(null); // 👈 New state
  const [form, setForm] = useState({
    title: link.title,
    url: link.url
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/links/${link.id}`, form);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Update failed", err);
      alert("Could not update link");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this link?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/links/${link.id}`);
      onDelete(link.id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete link");
    } finally {
      setLoading(false);
    }
  };

  // 👇 Fetch analytics for the last 28 days
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const count = await getLinkAnalytics(link.id);
        setRecentClicks(count);
      } catch (err) {
        console.error("Analytics fetch failed", err);
      }
    };

    fetchAnalytics();
  }, [link.id]);

  return (
    <tr className="border-t">
      <td className="p-2">
        {isEditing ? (
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        ) : (
          link.title
        )}
      </td>

      <td className="p-2 text-blue-600 break-words">
        {isEditing ? (
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        ) : (
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.url}
          </a>
        )}
      </td>

      <td className="p-2 text-center">
        {link.clickCount ?? 0}
        {recentClicks !== null && (
          <div className="text-xs text-gray-500">+{recentClicks} (28d)</div>
        )}
      </td>

      <td className="p-2 space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-2 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-2 py-1 rounded"
              disabled={loading}
            >
              {loading ? "..." : "Delete"}
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default LinkRow;
