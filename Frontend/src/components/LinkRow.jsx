import React, { useState } from 'react';
import axios from 'axios';

const LinkRow = ({ link, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: link.title,
    url: link.url
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/links/${link.id}`, form);
      setIsEditing(false);
      onUpdate(); // refresh list
    } catch (err) {
      console.error("Update failed", err);
      alert("Could not update link");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/links/${link.id}`);
      onDelete(link.id); // remove from list
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete link");
    }
  };

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

      <td className="p-2 text-blue-600">
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

      <td className="p-2 text-center">{link.clickCount || 0}</td>

      <td className="p-2 space-x-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default LinkRow;
