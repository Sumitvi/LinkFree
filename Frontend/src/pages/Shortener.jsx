import React, { useState, useEffect } from 'react';
import { Trash2 } from "lucide-react";
import axios from 'axios';

const Shortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [history, setHistory] = useState([]);

  const username = localStorage.getItem("username");
  const API_BASE = "http://localhost:8080"; 
  const FRONT_BASE = window.location.origin; 

  const handleShorten = async () => {
    if (!originalUrl) return;
    try {
      const res = await axios.post(`${API_BASE}/api/shorten`, {
        username,
        originalUrl
      });

      const code = res.data.shortCode || res.data.code || res.data.shortUrl?.split('/').pop();
      const fullShortUrl = `${FRONT_BASE}/s/${code}`;
      setShortUrl(fullShortUrl);
      setOriginalUrl('');
      fetchLinks(); // refresh history
    } catch (err) {
      console.error(err);
      alert("Failed to shorten URL");
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/shorten/all/${username}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/shorten/${id}`);
      setHistory(prev => prev.filter(link => link.id !== id)); // update UI
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete short link");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6 space-y-4">
      <h2 className="text-2xl font-bold">🔗 Link Shortener</h2>

      <input
        type="text"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="Paste long URL..."
        className="w-full border p-2"
      />

      <button
        onClick={handleShorten}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Generate Short Link
      </button>

      {shortUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">Shortened:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
            {shortUrl}
          </a>
        </div>
      )}

      {/* History */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">📜 Your Short Links</h3>
        <ul className="space-y-2">
          {history.map((item) => {
            const fullShort = `${FRONT_BASE}/s/${item.shortCode}`;
            return (
              <li key={item.id} className="border p-2 rounded bg-gray-50 flex justify-between items-center">
                <div>
                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    {item.originalUrl}
                  </a>
                  <p className="text-xs text-gray-700">
                    Short: <a href={fullShort} target="_blank" rel="noreferrer">{item.shortCode}</a>
                  </p>
                  <p className="text-xs text-gray-500">Visits: {item.visitCount}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={20} className="text-red-500 hover:text-red-700 cursor-pointer" />

                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Shortener;
