import React, { useState } from 'react';
import axios from 'axios';
import FlashMessage from './FlashMessage';
import { API_BASE_URL } from '../services/api'; 


const AddLink = ({ onLinkAdded }) => {
  const [form, setForm] = useState({
    title: '',
    url: '',
    icon: '',
    enabled: true
  });

  const [flash, setFlash] = useState({ message: '', type: '' });
  const username = localStorage.getItem("username");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const showFlash = (message, type = 'success') => {
    setFlash({ message, type });
    setTimeout(() => setFlash({ message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/links/${username}/add`, form);      setForm({ title: '', url: '', icon: '', enabled: true });
      showFlash("✅ Link added successfully!", "success");
      onLinkAdded();
    } catch (err) {
      console.error(err);
      showFlash("❌ Error adding link", "error");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {flash.message && (
        <FlashMessage
          message={flash.message}
          type={flash.type}
          onClose={() => setFlash({ message: '', type: '' })}
        />
      )}
      <h2 className="text-lg sm:text-xl font-bold text-orange-600 mb-4">➕ Add New Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Link title"
            required
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">URL</label>
          <input
            type="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://example.com"
            required
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Icon</label>
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="e.g., 🔗 or FontAwesome class"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Add Link
        </button>
      </form>
    </div>
  );
};

export default AddLink;
