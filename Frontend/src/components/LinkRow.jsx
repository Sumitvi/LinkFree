import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getLinkAnalytics } from '../services/api';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import FlashMessage from './FlashMessage'; 

const LinkRow = ({ link, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentClicks, setRecentClicks] = useState(null);
  const [flash, setFlash] = useState({ message: '', type: '' });

  const [form, setForm] = useState({
    title: link.title,
    url: link.url,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/links/${link.id}`, form);
      setIsEditing(false);
      onUpdate();
      setFlash({ message: 'Link updated successfully', type: 'success' });
    } catch (err) {
      setFlash({ message: 'Failed to update link', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {


    const confirmed = window.confirm("Are you sure you want to delete this link?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/links/${link.id}`);
      onDelete(link.id);
      setFlash({ message: 'Link deleted successfully', type: 'success' });
    } catch (err) {
      setFlash({ message: 'Failed to delete link', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const count = await getLinkAnalytics(link.id);
        setRecentClicks(count);
      } catch {
        
      }
    };
    fetchAnalytics();
  }, [link.id]);

  return (
    <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[180px]">
   
      <FlashMessage
        message={flash.message}
        type={flash.type}
        onClose={() => setFlash({ message: '', type: '' })}
      />

      <div className="mb-3">
        {isEditing ? (
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            placeholder="Title"
          />
        ) : (
          <h3 className="text-lg font-semibold text-orange-700 break-words">{link.title}</h3>
        )}

        {isEditing ? (
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="URL"
          />
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-words text-sm"
          >
            {link.url}
          </a>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <span className="text-sm text-gray-600">
          🔥 {link.clickCount ?? 0} clicks
          {recentClicks !== null && (
            <span className="text-xs text-gray-400 ml-1">(+{recentClicks} in 28d)</span>
          )}
        </span>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
                disabled={loading}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkRow;
