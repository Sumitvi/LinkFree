import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) {
        alert("Username not found in localStorage!");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:8080/api/users/${user.id}`, user);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading settings...</div>;
  if (!user) return <div className="text-center text-red-500 mt-10">User not found!</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={user.username}
          disabled
          className="w-full border p-2 mb-4 bg-gray-100"
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          disabled
          className="w-full border p-2 mb-4 bg-gray-100"
        />

        <label className="block mb-2 font-medium">Bio</label>
        <textarea
          name="bio"
          value={user.bio || ''}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />

        <label className="block mb-2 font-medium">Avatar URL</label>
        <input
          type="text"
          name="avatarUrl"
          value={user.avatarUrl || ''}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        />

        <label className="block mb-2 font-medium">Theme</label>
        <select
          name="theme"
          value={user.theme || 'light'}
          onChange={handleChange}
          className="w-full border p-2 mb-4"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
