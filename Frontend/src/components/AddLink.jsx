import React, { useState } from 'react';
import axios from 'axios';

const AddLink = ({ onLinkAdded }) => {
  const [form, setForm] = useState({
    title: '',
    url: '',
    icon: '',
    enabled: true
  });

  const username = localStorage.getItem("username"); // ✅ Get it here

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/links/${username}/add`, form);
      setForm({ title: '', url: '', icon: '', enabled: true });
      onLinkAdded(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error adding link");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-bold mb-2">Add New Link</h2>
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="url"
        name="url"
        value={form.url}
        onChange={handleChange}
        placeholder="https://example.com"
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="text"
        name="icon"
        value={form.icon}
        onChange={handleChange}
        placeholder="Icon (optional)"
        className="w-full border p-2 mb-2"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Add Link</button>
    </form>
  );
};

export default AddLink;
