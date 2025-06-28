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

  const gradientPresets = [
    { label: "Blue to Purple", value: "from-blue-500 to-purple-500" },
    { label: "Pink to Yellow", value: "from-pink-500 to-yellow-500" },
    { label: "Green to Cyan", value: "from-green-400 to-cyan-500" },
    { label: "Indigo to Red", value: "from-indigo-500 to-red-400" },
  ];

  if (loading) return <div className="text-center mt-10">Loading settings...</div>;
  if (!user) return <div className="text-center text-red-500 mt-10">User not found!</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input type="text" name="username" value={user.username} disabled className="w-full border p-2 bg-gray-100" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" name="email" value={user.email} disabled className="w-full border p-2 bg-gray-100" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea name="bio" value={user.bio || ''} onChange={handleChange} className="w-full border p-2" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Avatar URL</label>
          <input type="text" name="avatarUrl" value={user.avatarUrl || ''} onChange={handleChange} className="w-full border p-2" />
        </div>

        {/* Social Links */}
        <div><label className="block mb-1">GitHub</label><input type="text" name="github" value={user.github || ""} onChange={handleChange} className="w-full border p-2" /></div>
        <div><label className="block mb-1">LinkedIn</label><input type="text" name="linkedin" value={user.linkedin || ""} onChange={handleChange} className="w-full border p-2" /></div>
        <div><label className="block mb-1">Instagram</label><input type="text" name="instagram" value={user.instagram || ""} onChange={handleChange} className="w-full border p-2" /></div>
        <div><label className="block mb-1">Twitter</label><input type="text" name="twitter" value={user.twitter || ""} onChange={handleChange} className="w-full border p-2" /></div>

        {/* Customizations */}
        <div>
          <label className="block mb-1 font-medium">Theme</label>
          <select name="theme" value={user.theme || 'light'} onChange={handleChange} className="w-full border p-2">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="neon">Neon</option>
            <option value="pastel">Pastel</option>
            <option value="ocean">Ocean</option>
            <option value="pastel">Minimalist</option>
            <option value="ocean">Retro</option>
            
          </select>

        </div>

        <div>
          <label className="block mb-1 font-medium">Button Shape</label>
          <select name="buttonShape" value={user.buttonShape || "rounded"} onChange={handleChange} className="w-full border p-2">
            <option value="rounded">Rounded</option>
            <option value="square">Square</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Button Size</label>
          <select name="buttonSize" value={user.buttonSize || "md"} onChange={handleChange} className="w-full border p-2">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Button Color</label>
          <input type="color" name="buttonColor" value={user.buttonColor || "#1d4ed8"} onChange={handleChange} className="w-24 h-10 p-1 border cursor-pointer" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Font Style</label>
          <select name="fontStyle" value={user.fontStyle || "sans"} onChange={handleChange} className="w-full border p-2">
            <option value="sans">Sans</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Background Gradient</label>
          <select name="backgroundGradient" value={user.backgroundGradient || ""} onChange={handleChange} className="w-full border p-2">
            <option value="">None</option>
            {gradientPresets.map(preset => (
              <option key={preset.value} value={preset.value}>{preset.label}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={saving}>
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
