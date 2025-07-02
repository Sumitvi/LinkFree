import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FlashMessage from '../components/FlashMessage'; 

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(null); 

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) {
        setFlash({ type: 'error', message: 'Username not found in localStorage!' });
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setFlash({ type: 'error', message: 'Failed to fetch user details' });
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
      setFlash({ type: 'success', message: '✅ Profile updated successfully!' });
    } catch (err) {
      console.error("❌ Update failed:", err);
      setFlash({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const gradientPresets = [
    { label: "Blue to Purple", value: "from-blue-500 to-purple-500" },
    { label: "Pink to Yellow", value: "from-pink-500 to-yellow-500" },
    { label: "Green to Cyan", value: "from-green-400 to-cyan-500" },
    { label: "Indigo to Red", value: "from-indigo-500 to-red-400" },
  ];

  if (loading) return <div className="text-center mt-10">Loading settings...</div>;
  if (!user) return <div className="text-center text-red-500 mt-10">User not found!</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Profile Settings</h2>

      {flash && <FlashMessage type={flash.type} message={flash.message} />}

      <form onSubmit={handleSubmit} className="space-y-5">


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            disabled
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md text-gray-600"
          />
        </div>


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            disabled
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md text-gray-600"
          />
        </div>


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={user.bio || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            rows={3}
          />
        </div>


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Avatar URL</label>
          <input
            type="text"
            name="avatarUrl"
            value={user.avatarUrl || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["github", "linkedin", "instagram", "twitter"].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-semibold capitalize text-gray-700">{field}</label>
              <input
                type="text"
                name={field}
                value={user[field] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
          ))}
        </div>


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Theme</label>
          <select
            name="theme"
            value={user.theme || "light"}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="neon">Neon</option>
            <option value="pastel">Pastel</option>
            <option value="ocean">Ocean</option>
            <option value="minimalist">Minimalist</option>
            <option value="retro">Retro</option>
          </select>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Button Shape</label>
            <select
              name="buttonShape"
              value={user.buttonShape || "rounded"}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Button Size</label>
            <select
              name="buttonSize"
              value={user.buttonSize || "md"}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Button Color</label>
            <input
              type="color"
              name="buttonColor"
              value={user.buttonColor || "#1d4ed8"}
              onChange={handleChange}
              className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Font Style</label>
          <select
            name="fontStyle"
            value={user.fontStyle || "sans"}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
        </div>


        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Background Gradient</label>
          <select
            name="backgroundGradient"
            value={user.backgroundGradient || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            <option value="">None</option>
            {gradientPresets.map(preset => (
              <option key={preset.value} value={preset.value}>{preset.label}</option>
            ))}
          </select>
        </div>


        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md w-full mt-4 transition"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
