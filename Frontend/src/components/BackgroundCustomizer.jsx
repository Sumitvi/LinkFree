import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const themes = [
  'WhiteCanvas', 'ShadowyGray', 'LinearSky', 'SubtleGrayDots',
  'BlurredFuchsia', 'MaskedGray', 'GradientGrid', 'LightGrayLines',
  'RadiantBlue', 'GradientOrb', 'RadialHalo', 'VividCircles'
];

const BackgroundCustomizer = () => {
  const [selectedTheme, setSelectedTheme] = useState('WhiteCanvas');
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // 1. Load user data from backend
  useEffect(() => {
    if (username) {
      axios.get(`${API_BASE_URL}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const user = res.data;
        setSelectedTheme(user.theme || 'WhiteCanvas');
        setUserId(user.id);
      })
      .catch(err => {
        console.error("Failed to load user:", err);
      });
    }
  }, [username]);

  // 2. When theme changes, update live and send to backend
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);

    if (userId) {
      axios.put(`${API_BASE_URL}/users/${userId}`, {
        theme: theme
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        console.log("Theme updated successfully");
      }).catch(err => {
        console.error("Theme update failed", err);
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left: Theme Picker */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Background</h2>
        <p className="text-gray-600 mb-4">Customize your background theme from here.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`p-3 text-sm rounded border transition-all ${
                selectedTheme === theme ? 'bg-gray-200 border-orange-500 font-semibold' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="flex-1 flex justify-center items-center">
        <div className={`w-[280px] h-[550px] rounded-[2rem] overflow-hidden shadow-lg border-4 border-black ${selectedTheme}`}>
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
            {/* <button className="px-6 py-2 rounded-full bg-white text-black font-semibold shadow">Amazon</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundCustomizer;
