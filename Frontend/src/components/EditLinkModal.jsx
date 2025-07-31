import React, { useState } from 'react';
import axios from 'axios';
import FlashMessage from './FlashMessage';
import { API_BASE_URL } from '../services/api'; 


const EditLinkModal = ({ link, onClose, onSave }) => {
  const [form, setForm] = useState({ ...link });
  const [flash, setFlash] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/links/update/${form.id}`, form);
      setFlash({ message: '✅ Link updated successfully!', type: 'success' });
      setTimeout(() => {
        onSave();
        onClose();
      }, 1000);
    } catch (err) {
      setFlash({ message: err.response?.data || 'Failed to update link', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <FlashMessage message={flash.message} type={flash.type} onClose={() => setFlash({ message: '', type: '' })} />

        <h2 className="text-lg font-semibold text-orange-600 mb-4">Edit Link</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Title"
            required
          />
          <input
            type="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="https://example.com"
            required
          />
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Icon (optional)"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLinkModal;
